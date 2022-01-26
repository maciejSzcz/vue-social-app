<template>
  <n-space justify="center" class="publicity-radio" v-if="isLoggedIn && !id">
    <n-radio-group size="large" v-model:value="publicity">
      <n-radio-button size="large" value="publicPosts">
        Public posts
      </n-radio-button>
      <n-radio-button size="large" value="privatePosts">
        Private posts
      </n-radio-button>
    </n-radio-group>
  </n-space>
  <div class="posts-wrapper" v-if="posts?.length">
    <PostForm v-if="isLoggedIn && !id" @getPosts="getPosts" />
    <div
      class="post"
      :class="visibility"
      v-for="post in posts"
      :key="post?._id"
    >
      <n-card>
        <template #header v-if="post?.createdBy?._id && !id">
          <n-space justify="space-between">
            <n-space>
              <n-avatar class="avatar">
                {{ getInitials(post?.createdBy) }}
              </n-avatar>
              <router-link
                :to="{ name: 'User', params: { id: post?.createdBy?._id } }"
              >
                {{ post?.createdBy?.first_name }}
                {{ post?.createdBy?.last_name }}
              </router-link>
            </n-space>
            <n-p>
              <n-time
                class="creation-time"
                :time="this.parseISO(post?.createdAt)"
                :to="new Date()"
                type="relative"
              />
            </n-p>
          </n-space>
        </template>
        <template #header v-else-if="!id">
          {{ post?.createdBy?.first_name }} {{ post?.createdBy?.last_name }}
        </template>
        <template #header v-else>
          <n-h6 prefix="bar" align-text type="success">
            <n-time
              class="creation-time"
              :time="this.parseISO(post?.createdAt)"
              :to="new Date()"
              type="relative"
            />
          </n-h6>
        </template>
        <div
          class="post-content"
          v-html="post?.content"
          v-linkified:options="{ className: 'customLink' }"
        />
        <n-space class="post-actions" v-if="isLoggedIn">
          <router-link
            :to="{
              name: 'Post',
              params: { id: post?._id },
              query: { publicity: this.publicity },
            }"
          >
            <div class="comment-text">
              Comments
              <n-icon class="comment-icon" size="20">
                <chatbox-outline />
              </n-icon>
            </div>
          </router-link>
        </n-space>
      </n-card>
    </div>
  </div>
  <div class="posts-wrapper" v-else>
    <template v-if="loading">
      <div class="post">
        <n-card>
          <template #header>
            <n-skeleton text width="50%" />
          </template>
          <n-skeleton text :repeat="3" />
        </n-card>
      </div>
    </template>
    <template v-else>
      <PostForm v-if="isLoggedIn && !id" @getPosts="getPosts" />
      <div class="post empty">
        <n-card class="empty">
          <n-empty description="No posts found" />
        </n-card>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";
import { parseISO } from "date-fns";
import PostForm from "@/components/PostForm";
import getInitials from "@/utils/getInitials";
import { ChatboxOutline } from "@vicons/ionicons5";

export default {
  name: "Posts",
  components: {
    PostForm,
    ChatboxOutline,
  },
  props: {
    visibility: String,
    id: String,
  },
  data() {
    return {
      posts: null,
      loading: false,
      publicity: "publicPosts",
    };
  },
  computed: {
    ...mapGetters(["isUserPresent", "isLoggedIn"]),
  },
  methods: {
    parseISO(timeStamp) {
      return parseISO(timeStamp);
    },
    async getPosts() {
      this.loading = true;

      const url = this?.id
        ? `/posts/user/${this?.id}/${this?.visibility}`
        : `/posts/${this.publicity}`;

      return axios
        .get(url)
        .then((res) => {
          this.posts = res.data?.data;
          this.loading = false;
        })
        .catch(() => {
          this.displayError("Unexpected error while fetching posts");
          this.loading = false;
        });
    },
    getInitials(post) {
      return getInitials(post);
    },
  },
  mounted() {
    this.getPosts();
  },
  watch: {
    isUserPresent() {
      this.getPosts();
    },
    publicity() {
      this.getPosts();
    },
  },
  setup() {
    const message = useMessage();
    return {
      displayError(err) {
        message.error(err, {
          duration: 5000,
        });
      },
    };
  },
};
</script>

<style scoped>
.posts-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.post {
  min-width: 50%;
  margin: 1rem 0;
}

.post.public,
.post.private {
  min-width: 90%;
}

.empty {
  padding: 6rem 0;
}

a {
  color: #42b983;
}

.post-content :deep(.customLink) {
  color: #42b983;
}

.post-actions {
  padding-top: 2rem;
}

.comment-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

.comment-icon {
  padding: 0 0.7rem;
}

.publicity-radio {
  padding: 1.5rem 0;
}
</style>

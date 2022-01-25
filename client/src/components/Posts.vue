<template>
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
          <n-space>
            <n-avatar class="avatar">
              {{ getInitials(post?.createdBy) }}
            </n-avatar>
            <router-link
              :to="{ name: 'User', params: { id: post?.createdBy?._id } }"
            >
              {{ post?.createdBy?.first_name }} {{ post?.createdBy?.last_name }}
            </router-link>
          </n-space>
        </template>
        <template #header v-else-if="!id">
          {{ post?.createdBy?.first_name }} {{ post?.createdBy?.last_name }}
        </template>
        <div
          class="post-content"
          v-html="post?.content"
          v-linkified:options="{ className: 'customLink' }"
        />
        <n-space class="post-actions" v-if="isLoggedIn">
          <router-link :to="{ name: 'Post', params: { id: post?._id } }">
            <n-icon size="20">
              <chatbox-outline />
            </n-icon>
          </router-link>
        </n-space>
      </n-card>
    </div>
  </div>
  <div class="posts-wrapper" v-else>
    <template v-if="loading">
      <div class="post" v-for="i in 3" :key="i">
        <n-card>
          <template #header>
            <n-skeleton text width="50%" />
          </template>
          <n-skeleton text :repeat="4" />
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
    };
  },
  computed: {
    ...mapGetters(["isUserPresent", "isLoggedIn"]),
  },
  methods: {
    async getPosts() {
      this.loading = true;

      const url = this?.id
        ? `/posts/user/${this?.id}/${this?.visibility}`
        : "/posts";

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

.post-content >>> .customLink {
  color: #42b983;
}

.post-actions {
  padding-top: 2rem;
}
</style>

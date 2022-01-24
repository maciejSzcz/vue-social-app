<template>
  <div class="posts-wrapper" v-if="posts">
    <div class="post" v-for="post in posts" :key="post?._id">
      <n-card>
        <template #header v-if="post?.createdBy?._id">
          <router-link
            :to="{ name: 'User', params: { id: post?.createdBy?._id } }"
          >
            {{ post?.createdBy?.first_name }} {{ post?.createdBy?.last_name }}
          </router-link>
        </template>
        <template #header v-else>
          {{ post?.createdBy?.first_name }} {{ post?.createdBy?.last_name }}
        </template>
        <div v-html="post?.content" v-linkified />
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

export default {
  name: "Posts",
  data() {
    return {
      posts: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["userId", "isUserPresent"]),
  },
  methods: {
    async getPosts() {
      const message = useMessage();
      this.loading = true;

      return axios
        .get(this.userId ? `posts/${this.userId}` : "/posts")
        .then((res) => {
          this.posts = res.data?.data;
          this.loading = false;
        })
        .catch(() => {
          message.error("Error fetching posts", { duration: 5000 });
          this.loading = false;
        });
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

.empty {
  padding: 6rem 0;
}

a {
  color: #42b983;
}
</style>

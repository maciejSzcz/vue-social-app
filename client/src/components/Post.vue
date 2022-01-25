<template>
  <NavBar />
  <div class="post-wrapper" v-if="post">
    <div class="post">
      <n-card>
        <template #header v-if="post?.createdBy?._id">
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
        <template #header v-else>
          {{ post?.createdBy?.first_name }} {{ post?.createdBy?.last_name }}
        </template>
        <div
          class="post-content"
          v-html="post?.content"
          v-linkified:options="{ className: 'customLink' }"
        />
      </n-card>
    </div>
  </div>
  <div class="post-wrapper" v-else>
    <template v-if="loading">
      <div class="post">
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
          <n-empty description="No post found" />
        </n-card>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { useMessage } from "naive-ui";
import NavBar from "@/components/NavBar.vue";
import getInitials from "@/utils/getInitials";

export default {
  name: "Post",
  components: {
    NavBar,
  },
  props: {
    id: String,
  },
  data() {
    return {
      post: null,
      loading: false,
    };
  },
  methods: {
    async getPost() {
      this.loading = true;

      return axios
        .get(`/posts/${this.id}`)
        .then((res) => {
          this.post = res.data?.data;
          this.loading = false;
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            this.displayError("Unauthorized");
          } else {
            this.displayError("Unexpected error while fetching post");
          }
          this.loading = false;
        });
    },
    getInitials(_post) {
      return getInitials(_post);
    },
  },
  mounted() {
    this.getPost();
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
.post-wrapper {
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

.post-content >>> .customLink {
  color: #42b983;
}
</style>

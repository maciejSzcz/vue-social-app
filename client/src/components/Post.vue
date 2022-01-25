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
      <Comment
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
      />
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
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";
import NavBar from "@/components/NavBar.vue";
import Comment from "@/components/Comment.vue";
import getInitials from "@/utils/getInitials";
import SocketService from "@/services/SocketService";

export default {
  name: "Post",
  components: {
    NavBar,
    Comment,
  },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters(["isLoggedIn", "token", "userId"]),
  },
  data() {
    return {
      post: null,
      comments: null,
      loading: false,
      connected: false,
      socket: null,
    };
  },
  methods: {
    async getPost() {
      this.loading = true;

      return axios
        .get(`/posts/${this.id}`)
        .then((res) => {
          this.post = res.data?.data;
          this.comments = res.data?.data?.comments;
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
    async addComment() {
      this.socket.emit("comment", {
        author: this.userId,
        content: this.content,
        relatedPostId: this.id,
        publicity: "public", // TODO: FIX PUBLICITY
      });
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
  created() {
    if (this.isLoggedIn) {
      SocketService.setupSocketConnection();
      this.socket = SocketService.getSocket();
      this.socket.on("connect", () => {
        this.connected = true;
      });

      this.socket.on(this.id, (comments) => {
        this.comments = comments;
      });

      this.socket.on("disconnect", () => {
        this.connected = false;
      });
    }
  },
  beforeUnmount() {
    SocketService.disconnect();
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

.post-content :deep(.customLink) {
  color: #42b983;
}
</style>

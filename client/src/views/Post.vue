<template>
  <NavBar />
  <Loader :content="!!post" :loading="loading" notFoundMessage="Post not found">
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
      <div class="comment-wrapper">
        <n-card>
          <CommentForm @handleCommentSubmit="handleCommentSubmit" />
          <template v-if="comments">
            <n-divider title-placement="left">Comments</n-divider>
            <Comment
              v-for="comment in comments"
              :key="comment._id"
              :comment="comment"
            />
          </template>
        </n-card>
      </div>
    </div>
  </Loader>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";
import Loader from "@/components/Loader.vue";
import NavBar from "@/components/NavBar.vue";
import Comment from "@/components/Comment.vue";
import CommentForm from "@/components/CommentForm.vue";
import getInitials from "@/utils/getInitials";
import SocketService from "@/services/SocketService";

export default {
  name: "Post",
  components: {
    NavBar,
    Comment,
    CommentForm,
    Loader,
  },
  props: {
    id: String,
    publicity: String,
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
        .get(`/posts/${this.id}/${this.publicity}`)
        .then((res) => {
          this.post = res.data?.data;
          this.comments = res.data?.data?.comments;
          this.loading = false;
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            this.displayError("Unauthorized", true);
          } else {
            this.displayError("Unexpected error while fetching post");
          }
          this.loading = false;
        });
    },
    getInitials(_post) {
      return getInitials(_post);
    },
    async handleCommentSubmit(content) {
      this.socket.emit("comment", {
        author: this.userId,
        content: content,
        relatedPostId: this.id,
        publicity: this.publicity,
      });
    },
  },
  mounted() {
    this.getPost();
  },
  setup() {
    const message = useMessage();
    return {
      displayError(err, unauthorized) {
        message.error(err, {
          duration: 5000,
          onAfterLeave: () => (unauthorized ? this.$router.push("/") : null),
        });
      },
    };
  },
  created() {
    if (this.isLoggedIn) {
      SocketService.setupSocketConnection();
      this.socket = SocketService.getSocket();

      this.socket.on("error", () => {
        this.displayError("Unexpected connection error");
      });

      this.socket.on("connect", () => {
        this.connected = true;
        this.socket.emit("join", `${this.id}/${this.publicity}`);
      });

      this.socket.on(`${this.id}/${this.publicity}`, (comments) => {
        console.log(comments);
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

.comment-wrapper {
  margin: 1rem 0;
}

.post-content :deep(.customLink) {
  color: #42b983;
}
</style>

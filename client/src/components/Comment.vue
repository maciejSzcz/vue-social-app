<template>
  <div class="comment">
    <n-card>
      <template #header v-if="comment?.createdBy?._id">
        <n-space>
          <n-avatar class="avatar">
            {{ getInitials(comment?.createdBy) }}
          </n-avatar>
          <router-link
            :to="{ name: 'User', params: { id: comment?.createdBy?._id } }"
          >
            {{ comment?.createdBy?.first_name }}
            {{ comment?.createdBy?.last_name }}
          </router-link>
        </n-space>
      </template>
      <template #header v-else>
        {{ comment?.createdBy?.first_name }}
        {{ comment?.createdBy?.last_name }}
      </template>
      <div
        class="comment-content"
        v-html="comment?.content"
        v-linkified:options="{ className: 'customLink' }"
      />
      <div class="action-buttons-wrapper">
        <n-badge color="#18a058" :value="this.replies?.length">
          <n-button
            @click="showReplies"
            :disabled="!this.replies?.length"
            icon-placement="right"
          >
            {{ repliesVisible ? "Hide replies" : "Show replies" }}
            <template #icon>
              <n-icon class="comment-icon" size="20">
                <chatbox-outline />
              </n-icon>
            </template>
          </n-button>
        </n-badge>
        <n-badge class="reply-button">
          <n-button
            icon-placement="right"
            @click="replyFormVisible = !replyFormVisible"
          >
            Reply
            <template #icon>
              <n-icon class="comment-icon" size="20">
                <arrow-redo-outline />
              </n-icon>
            </template>
          </n-button>
        </n-badge>
      </div>
      <n-collapse-transition :show="replyFormVisible">
        <CommentForm :isReply="true" @handleCommentSubmit="handleReplySubmit" />
      </n-collapse-transition>
      <n-collapse-transition :show="repliesVisible">
        <n-space v-if="hasReplies" vertical>
          <Comment
            v-for="reply in this.replies"
            :key="reply?._id"
            :comment="reply"
          />
        </n-space>
      </n-collapse-transition>
    </n-card>
  </div>
</template>

<script>
import getInitials from "@/utils/getInitials";
import { mapGetters } from "vuex";
import SocketService from "@/services/SocketService";
import CommentForm from "@/components/CommentForm.vue";
import { ChatboxOutline, ArrowRedoOutline } from "@vicons/ionicons5";

export default {
  name: "Comment",
  components: {
    CommentForm,
    ChatboxOutline,
    ArrowRedoOutline,
  },
  props: {
    comment: Object,
  },
  computed: {
    ...mapGetters(["userId"]),
    hasReplies() {
      const replies = this.replies;
      return (
        replies?.length > 0 &&
        replies.every((reply) => typeof reply === "object" && reply !== null)
      );
    },
  },
  data() {
    return {
      replies: this.comment?.replies,
      connected: false,
      socket: null,
      repliesVisible: false,
      replyFormVisible: false,
    };
  },
  methods: {
    getInitials(_post) {
      return getInitials(_post);
    },
    async showReplies() {
      if (this.repliesVisible) {
        this.repliesVisible = false;
      } else {
        this.socket.emit("reply:get", {
          relatedCommentId: this.comment?._id,
        });
      }
    },
    async handleReplySubmit(content) {
      this.socket.emit("reply:add", {
        author: this.userId,
        relatedCommentId: this.comment?._id,
        content: content,
      });
    },
  },
  created() {
    SocketService.setupSocketConnection();
    this.socket = SocketService.getSocket();

    this.socket.on("error", () => {
      this.displayError("Unexpected connection error");
    });

    this.socket.on("connect", () => {
      this.connected = true;
      this.socket.emit("join", `${this.comment?._id}`);
    });

    this.socket.on(`${this.comment?._id}`, (replies) => {
      this.replies = replies;
      this.repliesVisible = true;
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
    });
  },
  beforeUnmount() {
    SocketService.disconnect();
  },
};
</script>
<style scoped>
a {
  color: #42b983;
}

.comment {
  margin: 1rem 0;
}

.comment-content :deep(.customLink) {
  color: #42b983;
}

.action-buttons-wrapper {
  margin: 1rem 0.2rem;
}

.reply-button {
  margin-left: 1rem;
}
</style>

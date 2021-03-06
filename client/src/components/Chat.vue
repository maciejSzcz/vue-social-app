<template>
  <div class="chat-wrapper">
    <div class="messages-list" v-if="this.messages?.length > 0">
      <ChatMessage
        v-for="message in this.messages"
        :key="message?._id"
        :message="message"
      />
    </div>
    <div class="messages-list" v-else>
      <n-empty class="empty" description="No messages with user found" />
    </div>
    <div class="message-form-wrapper">
      <form class="message-form" @submit.prevent="sendMessage">
        <n-input
          v-model:value="content"
          placeholder="Your message"
          maxlength="250"
          show-count
          type="text"
          size="small"
          required
          :on-focus="markAsRead"
        />
        <div class="action-button-wrapper">
          <n-space justify="flex-end">
            <n-button type="primary" attr-type="submit">
              Send message
            </n-button>
          </n-space>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SocketService from "@/services/SocketService";
import ChatMessage from "@/components/ChatMessage";

export default {
  name: "Messenger",
  props: {
    recipientId: String,
  },
  components: {
    ChatMessage,
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  data() {
    return {
      content: null,
      messages: null,
      connected: false,
      socket: null,
    };
  },
  methods: {
    sendMessage() {
      if (this.content && this.recipientId) {
        this.socket.emit("messages:send", {
          recipientId: this.recipientId,
          content: this.content,
        });
        this.content = null;
      }
    },
    markAsRead() {
      this.socket.emit("messages:read", {
        recipientId: this.recipientId,
      });
    },
  },
  watch: {
    recipientId() {
      if (this.recipientId) {
        this.socket.emit("joinChat", {
          recipientId: this.recipientId,
        });
        this.socket.on(`messageFrom:${this.recipientId}`, (messages) => {
          this.messages = messages;
        });
      }
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
      this.socket.emit("joinChat", {
        recipientId: this.recipientId,
      });
    });

    this.socket.on(`messageFrom:${this.userId}`, (messages) => {
      this.messages = messages;
    });

    this.socket.on(`messageFrom:${this.recipientId}`, (messages) => {
      this.messages = messages;
    });

    this.socket.on(`initialMessages:${this.userId}`, (messages) => {
      this.messages = messages;
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
.chat-wrapper {
  position: relative;
  height: 100%;
}

.message-form-wrapper {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.messages-list {
  max-height: 70vh;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

.message-form {
  display: flex;
}

.messages {
  max-height: 350px;
}

.action-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 1rem;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-top: 12rem;
}
</style>

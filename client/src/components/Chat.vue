<template>
  <div class="chat-wrapper">
    <n-scrollbar style="max-height: 70vh">
      <n-card v-for="i in 10" :key="i">
        <p>witam</p>
      </n-card>
    </n-scrollbar>
    <div class="message-form-wrapper">
      <n-divider />
      <form class="message-form" @submit.prevent="onSubmit">
        <n-input
          v-model:value="content"
          placeholder="Your message"
          maxlength="250"
          show-count
          type="text"
          size="small"
          required
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

export default {
  name: "Messenger",
  props: {
    recipientId: String,
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
  created() {
    SocketService.setupSocketConnection();
    this.socket = SocketService.getSocket();

    this.socket.on("error", () => {
      this.displayError("Unexpected connection error");
    });

    this.socket.on("connect", () => {
      this.connected = true;
      this.socket.emit("joinChat", this.userId);
    });

    this.socket.on(`messages:${this.userId}`, ({ messages }) => {
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
</style>

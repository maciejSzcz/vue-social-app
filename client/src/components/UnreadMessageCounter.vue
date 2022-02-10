<template>
  <div class="messaging-wrapper">
    <n-card>
      <router-link to="/messenger">
        <n-button type="primary">
          {{
            this.unreadMessagesCount > 0
              ? `You have ${this.unreadMessagesCount} unread messages`
              : "Messenger"
          }}
        </n-button>
      </router-link>
    </n-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SocketService from "@/services/SocketService";

export default {
  name: "UnreadMessageCounter",
  computed: {
    ...mapGetters(["userId"]),
    unreadMessagesCount() {
      return (
        this.messages?.filter((message) => message?.viewed === "false")
          ?.length ?? 0
      );
    },
  },
  data() {
    return {
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
      this.socket.emit("messages:get", this.userId);
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
.messaging-wrapper {
  position: fixed;
  bottom: 1em;
  right: 1em;
}

a {
  color: #42b983;
}
</style>

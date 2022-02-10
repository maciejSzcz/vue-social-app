<template>
  <NavBar />
  <div class="messenger-wrapper">
    <n-card class="messenger-user-list">
      <MessengerUserList
        :activeUsers="activeUsers"
        @recipientId="setRecipientId"
      />
    </n-card>
    <n-card class="messenger-current-chat">
      <Chat :recipientId="recipientId" v-if="recipientId" />
      <n-empty
        class="empty"
        description="Select a user to start a chat"
        v-else
      />
    </n-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SocketService from "@/services/SocketService";
import MessengerUserList from "@/components/MessengerUserList";
import NavBar from "@/components/NavBar.vue";
import Chat from "@/components/Chat";

export default {
  name: "Messenger",
  components: {
    NavBar,
    MessengerUserList,
    Chat,
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  data() {
    return {
      messages: null,
      connected: false,
      socket: null,
      recipientId: null,
      activeUsers: [],
    };
  },
  methods: {
    setRecipientId(recipientId) {
      this.recipientId = recipientId;
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
.messenger-wrapper {
  display: flex;
  height: 90vh;
}

.messenger-user-list {
  flex: 1;
  margin: 1rem;
}

.messenger-current-chat {
  flex: 3;
  margin: 1rem;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>

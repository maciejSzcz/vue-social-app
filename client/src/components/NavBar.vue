<template>
  <n-card>
    <n-space justify="space-between">
      <n-space>
        <router-link to="/">
          <n-avatar class="avatar">MW</n-avatar>
        </router-link>
        <n-badge :value="friendsRequestCount">
          <router-link class="user-link" to="/userList">
            <n-button>Users</n-button>
          </router-link>
        </n-badge>
      </n-space>
      <n-space>
        <template v-if="!isLoggedIn">
          <router-link to="/register">
            <n-button>Register</n-button>
          </router-link>
          <router-link to="/login">
            <n-button type="primary">Login</n-button>
          </router-link>
        </template>
        <template v-else>
          <n-gradient-text :size="18" class="username" type="success">
            {{ currentUser?.first_name ?? "" }}
            {{ currentUser?.last_name ?? "" }}
          </n-gradient-text>
          <router-link :to="{ name: 'User', params: { id: currentUser?._id } }">
            <n-button>Profile</n-button>
          </router-link>
          <n-button type="primary" @click="logout">Logout</n-button>
        </template>
      </n-space>
    </n-space>
  </n-card>
</template>
<script>
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";
import SocketService from "@/services/SocketService";

export default {
  name: "NavBar",
  data() {
    return {
      friendsRequestCount: this.currentUser?.friendsRequest?.length,
      socket: null,
      connected: false,
      message: null,
    };
  },
  emits: ["userNotification"],
  computed: {
    ...mapGetters(["isLoggedIn", "currentUser", "userId"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
  },
  watch: {
    message: {
      handler(prevValue, value) {
        if (prevValue !== value && prevValue) {
          this.displayNotification(prevValue);
        }
      },
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
      displayNotification(value) {
        message.info(value, {
          duration: 5000,
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
        this.socket.emit("join", `friendsRequests:${this.userId}`);
      });

      this.socket.on(
        `friendsRequests:${this.userId}`,
        ({ message, counter }) => {
          const currentCount = this.friendsRequestCount ?? 0;
          if (currentCount + counter >= 0) {
            this.friendsRequestCount = currentCount + counter;
          }
          this.message = message;
          this.$emit("userNotification");
          this.$store.dispatch("getUser");
        }
      );

      this.socket.on("connect", () => {
        this.connected = true;
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
.avatar {
  color: black;
  background-color: var(--n-color-target);
}

.username {
  padding: 0 2rem;
}

.user-link {
  margin-left: 1.5rem;
}
</style>

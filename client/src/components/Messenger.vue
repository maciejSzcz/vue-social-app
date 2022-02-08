<template>
  <div class="messaging-wrapper">
    <n-card>
      <p>Witam</p>
    </n-card>
  </div>
</template>

<script>
import getInitials from "@/utils/getInitials";
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";
import SocketService from "@/services/SocketService";

export default {
  name: "Comment",

  props: {
    comment: Object,
  },
  computed: {
    ...mapGetters(["userId"]),
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
    async showReplies() {},
    async handleReplySubmit() {},
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
.messaging-wrapper {
  position: fixed;
  bottom: 1em;
  right: 1em;
}
</style>

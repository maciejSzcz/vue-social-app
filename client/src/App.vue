<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-space class="spinner" justify="center" v-if="loading">
            <n-spin size="large" />
          </n-space>
          <router-view v-else />
          <UnreadMessageCounter v-if="isLoggedIn && !isMessengerView" />
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<script>
import {
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
} from "naive-ui";
import { mapGetters } from "vuex";
import UnreadMessageCounter from "@/components/UnreadMessageCounter.vue";

export default {
  name: "App",
  components: {
    NMessageProvider,
    NDialogProvider,
    NNotificationProvider,
    NLoadingBarProvider,
    UnreadMessageCounter,
  },
  computed: {
    ...mapGetters(["isUserPresent", "isLoggedIn"]),
    isMessengerView() {
      return this.$route?.name === "Messenger";
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    if (this.isLoggedIn && !this.isUserPresent) {
      this.loading = true;
      this.$store.dispatch("getUser").then(() => {
        this.loading = false;
      });
    }
  },
};
</script>
<style scoped>
.spinner {
  height: 100vh;
  align-items: center;
}
</style>

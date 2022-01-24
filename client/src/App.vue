<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-space class="spinner" justify="center" v-if="loading">
            <n-spin size="large" />
          </n-space>
          <router-view v-else />
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

export default {
  name: "App",
  components: {
    NMessageProvider,
    NDialogProvider,
    NNotificationProvider,
    NLoadingBarProvider,
  },
  computed: {
    ...mapGetters(["isUserPresent", "isLoggedIn"]),
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

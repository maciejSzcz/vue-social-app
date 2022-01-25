<template>
  <n-card>
    <n-space justify="space-between">
      <n-space>
        <router-link to="/">
          <n-avatar class="avatar">MW</n-avatar>
        </router-link>
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
            {{ user?.first_name ?? "" }} {{ user?.last_name ?? "" }}
          </n-gradient-text>
          <router-link :to="{ name: 'User', params: { id: user?._id } }">
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

export default {
  name: "Posts",
  computed: {
    ...mapGetters(["isLoggedIn", "user"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
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
</style>

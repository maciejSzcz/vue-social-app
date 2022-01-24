<template>
  <div class="login-wrapper">
    <n-card class="login-box" title="Log in">
      <form class="login-form" @submit.prevent="login">
        <n-space vertical>
          <n-form-item label="E-Mail">
            <n-input
              required
              v-model:value="email"
              type="email"
              placeholder="E-mail"
            />
          </n-form-item>
          <n-form-item label="Password">
            <n-input
              required
              v-model:value="password"
              type="password"
              show-password-on="mousedown"
              placeholder="Password"
            />
          </n-form-item>
          <n-button attr-type="submit" type="primary">Login</n-button>
        </n-space>
      </form>
    </n-card>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      const email = this.email;
      const password = this.password;

      this.$store
        .dispatch("login", { email, password })
        .then(() => this.$router.push("/"))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  width: 90%;
}

@media (min-width: 979px) {
  .login-box {
    width: 40%;
  }
}
</style>

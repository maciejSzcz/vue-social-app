<template>
  <div class="register-wrapper">
    <n-card class="register-box" title="Register">
      <form class="register-form" @submit.prevent="register">
        <n-space vertical>
          <n-form-item label="First name">
            <n-input
              required
              v-model:value="firstName"
              type="text"
              placeholder="First name"
            />
          </n-form-item>
          <n-form-item label="Last name">
            <n-input
              required
              v-model:value="lastName"
              type="text"
              placeholder="Last name"
            />
          </n-form-item>
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
          <n-button attr-type="submit" type="primary">Register</n-button>
        </n-space>
      </form>
    </n-card>
  </div>
</template>
<script>
export default {
  name: "Register",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      const first_name = this.firstName;
      const last_name = this.lastName;
      const email = this.email;
      const password = this.password;

      this.$store
        .dispatch("register", { first_name, last_name, email, password })
        .then(() => this.$router.push("/"))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-box {
  width: 90%;
}

@media (min-width: 979px) {
  .register-box {
    width: 40%;
  }
}
</style>

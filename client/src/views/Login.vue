<template>
  <div>
    <form class="login" @submit.prevent="login">
      <n-space vertical>
        <h1>Sign in</h1>
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
        <button type="submit">Login</button>
      </n-space>
    </form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters(["authStatus"]),
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

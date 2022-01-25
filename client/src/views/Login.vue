<template>
  <div class="login-wrapper">
    <n-card class="login-box" title="Log in">
      <form class="login-form" @submit.prevent="login">
        <n-space vertical>
          <n-space vertical>
            <n-text> Email </n-text>
            <n-input
              required
              v-model:value="email"
              type="email"
              placeholder="E-mail"
              @blur="v$.email.$touch"
            />
            <div class="error-space">
              <n-text type="error" v-if="v$.email.$error">
                Email has an error
              </n-text>
            </div>
          </n-space>
          <n-space vertical>
            <n-text> Password </n-text>
            <n-input
              required
              v-model:value="password"
              type="password"
              show-password-on="mousedown"
              placeholder="Password"
              @blur="v$.password.$touch"
            />
            <div class="error-space">
              <n-text type="error" v-if="v$.password.$error">
                Password is required
              </n-text>
            </div>
          </n-space>
          <n-space justify="space-between">
            <n-space>
              <n-text type="error" v-if="error">{{ error }}</n-text>
            </n-space>
            <n-button attr-type="submit" type="primary">Login</n-button>
          </n-space>
        </n-space>
      </form>
    </n-card>
  </div>
</template>
<script>
import { useMessage } from "naive-ui";
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      const isFormCorrect = await this.v$.$validate();

      if (isFormCorrect) {
        const email = this.email;
        const password = this.password;

        this.$store
          .dispatch("login", { email, password })
          .then(() => {
            this.error = "";
            this.$router.push("/");
          })
          .catch(({ response }) => {
            this.error = response?.data?.message;
            this.displayError(response?.data?.message);
          });
      }
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
      v$: useVuelidate(),
    };
  },
  validations() {
    return {
      password: { required },
      email: { required, email },
    };
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

.error-space {
  min-height: 1.2rem;
}

@media (min-width: 979px) {
  .login-box {
    width: 40%;
  }
}
</style>

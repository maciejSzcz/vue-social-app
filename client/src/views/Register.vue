<template>
  <div class="register-wrapper">
    <n-card class="register-box" title="Register">
      <form class="register-form" @submit.prevent="register">
        <n-space vertical>
          <n-space vertical>
            <n-text> First name </n-text>
            <n-input
              required
              v-model:value="firstName"
              type="text"
              placeholder="First name"
              @blur="v$.firstName.$touch"
            />
            <div class="error-space">
              <n-text type="error" v-if="v$.firstName.$error">
                First name is required
              </n-text>
            </div>
          </n-space>
          <n-space vertical>
            <n-text> Last name </n-text>
            <n-input
              required
              v-model:value="lastName"
              type="text"
              placeholder="Last name"
              @blur="v$.lastName.$touch"
            />
            <div class="error-space">
              <n-text type="error" v-if="v$.lastName.$error">
                Last name is required
              </n-text>
            </div>
          </n-space>
          <n-space vertical>
            <n-text> Email </n-text>
            <n-input
              required
              v-model:value="email"
              type="email"
              placeholder="Email"
              @blur="v$.email.$touch"
            />
            <div class="error-space">
              <n-text type="error" v-if="v$.email.$error">
                Email is required
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
          <n-button attr-type="submit" type="primary">Register</n-button>
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
        .catch(({ response }) => {
          this.displayError(response?.data?.message);
        });
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
      firstName: { required },
      lastName: { required },
      password: { required },
      email: { required, email },
    };
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

.error-space {
  min-height: 1.2rem;
}

@media (min-width: 979px) {
  .register-box {
    width: 40%;
  }
}
</style>

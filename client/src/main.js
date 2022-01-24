import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import naive from "naive-ui";
import Axios from "axios";
import linkify from "vue-linkify";

const token = sessionStorage.getItem("token");

Axios.defaults.baseURL =
  process.env.VUE_APP_BACKEND_URL ?? "https://localhost:8081/api";
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

createApp(App)
  .use(store)
  .use(router)
  .use(naive)
  .directive("linkified", linkify)
  .mount("#app");

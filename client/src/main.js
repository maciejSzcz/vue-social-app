import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import naive from "naive-ui";
import Axios from "axios";

Axios.defaults.baseURL = "https://localhost:8081/api";

createApp(App).use(store).use(router).use(naive).mount("#app");

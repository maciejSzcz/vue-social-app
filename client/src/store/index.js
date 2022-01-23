import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.status = "loading";
    },
    AUTH_SUCCESS(state, payload) {
      state.status = "success";
      state.token = payload.token;
      state.user = payload.user;
    },
    AUTH_ERROR(state) {
      state.status = "error";
    },
    LOGOUT(state) {
      state.status = "";
      state.token = "";
    },
  },
  actions: {
    login({ commit }, user) {
      commit("AUTH_REQUEST");

      return axios({
        url: "/login",
        data: user,
        method: "POST",
      })
        .then((resp) => {
          const token = resp.data.token;
          const user = resp.data.user;

          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          commit("AUTH_SUCCESS", { token: token, user: user });
        })
        .catch(() => {
          commit("AUTH_FAILURE");
          localStorage.removeItem("token");
        });
    },
    register({ commit }, user) {
      commit("AUTH_REQUEST");
      return axios({ url: "/register", data: user, method: "POST" })
        .then((resp) => {
          const token = resp.data.token;
          const user = resp.data.user;

          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = token;
          commit("AUTH_SUCCESS", { token: token, user: user });
        })
        .catch((err) => {
          commit("AUTH_ERROR", err);
          localStorage.removeItem("token");
        });
    },
    logout({ commit }) {
      commit("LOGOUT");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
  modules: {},
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
});

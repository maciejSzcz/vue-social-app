import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  state: {
    status: "",
    token: sessionStorage.getItem("token") || "",
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
    GET_USER_SUCCESS(state, payload) {
      state.status = "success";
      state.user = payload.user;
    },
    AUTH_FAILURE(state) {
      state.status = "error";
      state.token = "";
      state.user = {};
    },
    LOGOUT(state) {
      state.status = "";
      state.token = "";
      state.user = {};
    },
  },
  actions: {
    login({ commit }, user) {
      commit("AUTH_REQUEST");

      return axios({
        url: "/auth/login",
        data: user,
        method: "POST",
      })
        .then((resp) => {
          const token = resp.data.token;
          const user = resp.data.user;

          sessionStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          commit("AUTH_SUCCESS", { token: token, user: user });
        })
        .catch((err) => {
          commit("AUTH_FAILURE");
          sessionStorage.removeItem("token");
          throw err;
        });
    },
    register({ commit }, user) {
      commit("AUTH_REQUEST");
      return axios({ url: "/auth/register", data: user, method: "POST" })
        .then((resp) => {
          const token = resp.data.token;
          const user = resp.data.user;

          sessionStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          commit("AUTH_SUCCESS", { token: token, user: user });
        })
        .catch((err) => {
          commit("AUTH_FAILURE");
          sessionStorage.removeItem("token");
          throw err;
        });
    },
    logout({ commit }) {
      commit("LOGOUT");
      sessionStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },
    getUser({ commit }) {
      commit("AUTH_REQUEST");

      return axios({
        url: "/auth/currentUser",
        method: "GET",
      })
        .then((resp) => {
          const user = resp.data.data;

          commit("GET_USER_SUCCESS", { user: user });
        })
        .catch(() => {
          commit("AUTH_FAILURE");
          sessionStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        });
    },
  },
  modules: {},
  getters: {
    isLoggedIn: (state) => !!state.token,
    isUserPresent: (state) => !!state.user?._id,
    authStatus: (state) => state.status,
    userId: (state) => state.user?._id,
    user: (state) => state.user,
  },
});

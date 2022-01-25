import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import User from "@/views/User.vue";
import Post from "@/components/Post.vue";
import store from "@/store/index.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/user/:id",
    name: "User",
    component: User,
    props: true,
  },
  {
    path: "/post/:id",
    name: "Post",
    component: Post,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;

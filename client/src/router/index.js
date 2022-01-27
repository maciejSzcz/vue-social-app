import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/NotFound.vue";
import Register from "@/views/Register.vue";
import UserList from "@/views/UserList.vue";
import User from "@/views/User.vue";
import Post from "@/views/Post.vue";
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
    path: "/userList",
    name: "UserList",
    component: UserList,
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
    props: (route) => ({
      id: route.params.id,
      publicity: route.query?.publicity,
    }),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
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

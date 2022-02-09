<template>
  <NavBar />
  <div class="home">
    <Posts />
  </div>
  <Messenger v-if="isLoggedIn" />
</template>

<script>
import Posts from "@/components/Posts.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "Home",
  components: {
    Posts,
    NavBar,
  },
};
</script>

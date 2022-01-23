<template>
  <div class="posts-wrapper">
    <div class="post" v-for="user in users" :key="user?._id">
      <n-card :title="user?.first_name + ' ' + user?.last_name">
        {{ user?.email }}
        <div v-html="post" v-linkified />
      </n-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "HelloWorld",
  data() {
    return {
      users: null,
      post: "Check out the page at Greetings from vuejsfeed.com",
    };
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  methods: {
    async getUsers() {
      return axios
        .get(this.userId ? `users/${this.userId}` : "/users")
        .then((res) => {
          this.users = res.data?.data;
        })
        .catch(() => {
          console.err("Error fetching users");
        });
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped>
.posts-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.post {
  min-width: 80%;
  margin: 1rem 0;
}

a {
  color: #42b983;
}
</style>

<template>
  <NavBar />
  <div class="user-wrapper">
    <div v-if="user" class="user">
      <n-card :title="user?.first_name + ' ' + user?.last_name">
        {{ user?.email }}
        <n-card content-style="padding: 0;">
          <n-tabs
            type="line"
            size="large"
            :tabs-padding="20"
            pane-style="padding: 20px;"
          >
            <n-tab-pane name="Public">Public</n-tab-pane>
            <n-tab-pane name="Private">Private</n-tab-pane>
          </n-tabs>
        </n-card>
      </n-card>
    </div>
    <div v-else-if="loading" class="user">
      <n-card>
        <template #header>
          <n-skeleton text width="50%" />
        </template>
        <n-skeleton text :repeat="2" />
      </n-card>
    </div>
    <div v-else class="user">
      <n-card>
        <n-empty description="User not found" />
      </n-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
import { useMessage } from "naive-ui";

export default {
  name: "User",
  components: {
    NavBar,
  },
  props: {
    id: String,
  },
  data() {
    return {
      user: null,
      loading: false,
    };
  },
  methods: {
    async getUser() {
      const message = useMessage();
      this.loading = true;
      return axios
        .get(`users/${this.id}`)
        .then((res) => {
          this.user = res.data?.data;
          this.loading = false;
        })
        .catch(() => {
          message.error("Error fetching user", { duration: 5000 });
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getUser();
  },
};
</script>

<style scoped>
.user-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.user {
  min-width: 50%;
  margin: 1rem 0;
}

a {
  color: #42b983;
}
</style>

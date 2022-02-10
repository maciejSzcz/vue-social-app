<template>
  <n-card class="message">
    <n-space v-if="this.isSentByCurrentUser" justify="end">
      <p>{{ message?.content }}</p>
      <n-avatar class="avatar">
        {{ getInitials(message?.createdBy) }}
      </n-avatar>
    </n-space>
    <n-space v-else justify="start">
      <n-avatar class="avatar">
        {{ getInitials(message?.createdBy) }}
      </n-avatar>
      <p>{{ message?.content }}</p>
    </n-space>
  </n-card>
</template>

<script>
import { mapGetters } from "vuex";
import getInitials from "@/utils/getInitials";

export default {
  name: "ChatMessage",
  props: {
    message: Object,
  },
  computed: {
    ...mapGetters(["userId"]),
    isSentByCurrentUser() {
      return this.message?.createdBy?._id === this.userId;
    },
  },
  methods: {
    getInitials(_post) {
      return getInitials(_post);
    },
  },
};
</script>
<style scoped>
.message {
  margin: 0.3em 0;
}

.avatar {
  margin-top: 10px;
}
</style>

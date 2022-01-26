<template>
  <div class="comment">
    <n-card>
      <template #header v-if="comment?.createdBy?._id">
        <n-space>
          <n-avatar class="avatar">
            {{ getInitials(comment?.createdBy) }}
          </n-avatar>
          <router-link
            :to="{ name: 'User', params: { id: comment?.createdBy?._id } }"
          >
            {{ comment?.createdBy?.first_name }}
            {{ comment?.createdBy?.last_name }}
          </router-link>
        </n-space>
      </template>
      <template #header v-else>
        {{ comment?.createdBy?.first_name }}
        {{ comment?.createdBy?.last_name }}
      </template>
      <div
        class="comment-content"
        v-html="comment?.content"
        v-linkified:options="{ className: 'customLink' }"
      />
    </n-card>
  </div>
</template>

<script>
import getInitials from "@/utils/getInitials";

export default {
  name: "Comment",
  props: {
    comment: Object,
  },
  methods: {
    getInitials(_post) {
      return getInitials(_post);
    },
  },
};
</script>
<style scoped>
a {
  color: #42b983;
}

.comment {
  margin: 1rem 0;
}

.comment-content :deep(.customLink) {
  color: #42b983;
}
</style>

<template>
  <n-card title="Add comment">
    <form class="post-form" @submit.prevent="onSubmit">
      <n-input
        v-model:value="content"
        placeholder="Your comment"
        maxlength="1000"
        show-count
        type="textarea"
        size="small"
        required
        :autosize="{
          minRows: 2,
          maxRows: 3,
        }"
      />
      <n-space justify="flex-end" class="publicity-group">
        <n-button type="primary" attr-type="submit">Add comment</n-button>
      </n-space>
    </form>
  </n-card>
</template>

<script>
export default {
  name: "CommentForm",
  emits: ["handleCommentSubmit"],
  data() {
    return {
      content: null,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("handleCommentSubmit", this.content);
      this.content = null;
    },
  },
};
</script>

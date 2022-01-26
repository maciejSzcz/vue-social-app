<template>
  <n-divider title-placement="left">Add comment</n-divider>
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
        minRows: 3,
        maxRows: 4,
      }"
    />
    <div class="action-button-wrapper">
      <n-space justify="flex-end" class="publicity-group">
        <n-button type="primary" attr-type="submit">Add comment</n-button>
      </n-space>
    </div>
  </form>
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
<style scoped>
.action-button-wrapper {
  padding-top: 1rem;
}
</style>

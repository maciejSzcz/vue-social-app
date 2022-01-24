<template>
  <div class="post-wrapper">
    <n-card title="Add post">
      <form class="post-form" @submit.prevent="handlePostSubmit">
        <n-input
          v-model:value="postContent"
          placeholder="Your post"
          maxlength="1000"
          show-count
          type="textarea"
          size="small"
          required
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
        />
        <n-space justify="space-between" class="publicity-group">
          <n-radio-group v-model:value="publicity" name="publicity-group-radio">
            <n-radio-button
              v-for="option in options"
              :key="option?.value"
              :value="option?.value"
            >
              {{ option?.label }}
            </n-radio-button>
          </n-radio-group>
          <n-button type="primary" attr-type="submit">Add post</n-button>
        </n-space>
      </form>
    </n-card>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";

export default {
  name: "PostForm",
  emits: ["getPosts"],
  data() {
    return {
      postContent: "",
      publicity: "private",
      options: [
        {
          value: "private",
          label: "Private post",
        },
        {
          value: "public",
          label: "Public post",
        },
        {
          value: "general",
          label: "General post",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  methods: {
    async handlePostSubmit() {
      const isGeneral = this.publicity === "general";
      const url = isGeneral
        ? `/posts/${this.userId}`
        : `/posts/${this.userId}/${this.publicity}`;

      return axios
        .post(url, { content: this.postContent })
        .then(() => {
          this.postContent = "";
          this.publicity = "private";
          this.$emit("getPosts");
        })
        .catch(() => {
          this.displayError("An error occurred while adding post");
        });
    },
  },
  setup() {
    const message = useMessage();
    return {
      displayError(err) {
        message.error(err, {
          duration: 5000,
        });
      },
    };
  },
};
</script>
<style scoped>
.post-wrapper {
  min-width: 50%;
  margin: 1rem 0;
}

.publicity-group {
  padding: 1rem 0;
}
</style>

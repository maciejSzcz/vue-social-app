<template>
  <n-button type="primary" @click="showModal = true">Edit user</n-button>
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header>
      <div>Edit user</div>
    </template>
    <n-space vertical>
      <n-text>First name</n-text>
      <n-input
        v-model:value="userData.first_name"
        type="text"
        required
        placeholder="First name"
      />
    </n-space>
    <n-space vertical>
      <n-text>Last name</n-text>
      <n-input
        v-model:value="userData.last_name"
        type="text"
        required
        placeholder="Last name"
      />
    </n-space>
    <n-space vertical>
      <n-text>Email</n-text>
      <n-input
        v-model:value="userData.email"
        type="email"
        required
        placeholder="Email"
      />
    </n-space>
    <n-space vertical>
      <n-text>Description</n-text>
      <n-input
        v-model:value="userData.description"
        placeholder="Description"
        maxlength="500"
        show-count
        type="textarea"
        size="small"
        :autosize="{
          minRows: 3,
          maxRows: 4,
        }"
      />
    </n-space>
    <template #action>
      <n-button type="primary" @click="handleEditSubmit">Save</n-button>
    </template>
  </n-modal>
</template>
<script>
import axios from "axios";
import { useMessage } from "naive-ui";

export default {
  name: "EditUserModal",
  props: {
    user: Object,
  },
  emits: ["getUser"],
  data() {
    return {
      userData: {
        first_name: this.user?.first_name,
        last_name: this.user?.last_name,
        email: this.user?.email,
        description: this.user?.description,
      },
      showModal: false,
    };
  },
  methods: {
    async handleEditSubmit() {
      const { first_name, last_name, email } = this.userData;

      if (!!first_name && !!last_name && !!email) {
        return axios
          .put(`/users/${this.user?._id}`, this.userData)
          .then(() => {
            this.$emit("getUser");
            this.showModal = false;
          })
          .catch(({ response }) => {
            if (response?.status === 401) {
              this.displayError("Unauthorized");
            } else {
              this.displayError("An error occurred while adding post");
            }
          });
      }
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

<template>
  <NavBar />
  <Loader :content="!!user" :loading="loading" notFoundMessage="User not found">
    <div class="user">
      <n-card :title="user?.first_name + ' ' + user?.last_name">
        <template #header>
          <n-space justify="space-between">
            <n-space>
              <n-avatar>
                {{ getInitials(user) }}
              </n-avatar>
              <n-text> {{ user?.first_name }} {{ user?.last_name }} </n-text>
            </n-space>
            <template v-if="isLoggedIn && id !== userId">
              <n-button v-if="isPending" @click="handleRemoveFriendClick">
                Cancel request
              </n-button>
              <div v-else-if="isPendingAcceptance">
                <n-button @click="handleRemoveFriendClick">
                  Reject request
                </n-button>
                <n-button @click="handleAddFriendClick">
                  Accept request
                </n-button>
              </div>
              <n-button
                type="primary"
                v-else-if="!user?.isFriend"
                @click="handleAddFriendClick"
              >
                Add friend
              </n-button>
              <n-button v-else @click="handleRemoveFriendClick">
                Remove friend
              </n-button>
            </template>
          </n-space>
        </template>
        {{ user?.email }}
      </n-card>
      <n-card class="wall-tabs" content-style="padding: 0;">
        <n-tabs
          type="segment"
          size="large"
          :tabs-padding="20"
          pane-style="padding: 20px;"
          v-if="user?.isFriend || user._id === userId"
        >
          <n-tab-pane name="Public">
            <Posts visibility="public" :id="this?.id" />
          </n-tab-pane>
          <n-tab-pane name="Private">
            <Posts visibility="private" :id="this?.id" />
          </n-tab-pane>
        </n-tabs>
        <template v-else>
          <Posts visibility="public" :id="this?.id" />
        </template>
      </n-card>
    </div>
  </Loader>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import NavBar from "@/components/NavBar.vue";
import Posts from "@/components/Posts.vue";
import Loader from "@/components/Loader.vue";
import getInitials from "@/utils/getInitials";
import { useMessage } from "naive-ui";

export default {
  name: "User",
  components: {
    NavBar,
    Posts,
    Loader,
  },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters(["isLoggedIn", "userId", "currentUser"]),
    isPending() {
      return this?.user?.friendsRequest.indexOf(this?.userId) >= 0;
    },
    isPendingAcceptance() {
      return this?.currentUser?.friendsRequest.indexOf(this.id) >= 0;
    },
  },
  data() {
    return {
      user: null,
      loading: false,
    };
  },
  methods: {
    async getUser() {
      this.loading = true;

      const url = this.isLoggedIn
        ? `users/${this.id}`
        : `users/${this.id}/public`;

      return axios
        .get(url)
        .then((res) => {
          this.user = res.data?.data;
          this.loading = false;
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            this.displayError("Unauthorized");
          } else {
            this.displayError("Unexpected error while fetching user");
          }
          this.loading = false;
        });
    },
    async handleAddFriendClick() {
      return axios
        .post(`users/${this.id}/friends`)
        .then(() => {
          this.getUser();
          this.$store.dispatch("getUser");
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            this.displayError("Unauthorized");
          } else {
            this.displayError(response?.data?.message);
          }
        });
    },
    async handleRemoveFriendClick() {
      return axios
        .delete(`users/${this.id}/friends`)
        .then(() => {
          this.getUser();
          this.$store.dispatch("getUser");
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            this.displayError("Unauthorized");
          } else {
            this.displayError(response?.data?.message);
          }
        });
    },
    getInitials(post) {
      return getInitials(post);
    },
  },
  mounted() {
    this.getUser();
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
.user {
  min-width: 50%;
  margin: 1rem 0;
}

.wall-tabs {
  margin: 2rem 0;
}

a {
  color: #42b983;
}
</style>

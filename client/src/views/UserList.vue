<template>
  <NavBar @userNotification="getUsers" />
  <div class="center">
    <n-input
      v-model:value="search"
      @input="searchUsers"
      :loading="loading || searchLoading"
      placeholder="Search"
      class="search-bar"
      type="text"
    />
  </div>
  <Loader
    :content="!!users"
    :loading="loading"
    notFoundMessage="Users not found"
  >
    <div class="user" v-for="user in users" :key="user?._id">
      <n-card>
        <n-space justify="space-between">
          <n-space>
            <n-avatar class="avatar">
              {{ getInitials(user) }}
            </n-avatar>
            <router-link :to="{ name: 'User', params: { id: user?._id } }">
              {{ user?.first_name }}
              {{ user?.last_name }}
            </router-link>
          </n-space>
          <template v-if="isLoggedIn && user?._id !== userId">
            <n-button
              v-if="isPending(user)"
              @click="() => handleRemoveFriendClick(user?._id)"
            >
              Cancel request
            </n-button>
            <div v-else-if="isPendingAcceptance(user)">
              <n-button
                class="reject-button"
                @click="() => handleRemoveFriendClick(user?._id)"
              >
                Reject request
              </n-button>
              <n-button
                type="primary"
                @click="() => handleAddFriendClick(user?._id)"
              >
                Accept request
              </n-button>
            </div>
            <n-button
              type="primary"
              v-else-if="!user?.isFriend"
              @click="() => handleAddFriendClick(user?._id)"
            >
              Add friend
            </n-button>
            <n-button v-else @click="() => handleRemoveFriendClick(user?._id)">
              Remove friend
            </n-button>
          </template>
        </n-space>
      </n-card>
    </div>
  </Loader>
  <div class="center">
    <n-pagination
      v-model:page="page"
      v-model:page-size="limit"
      v-model:page-count="pageCount"
      :page-sizes="[10, 20, 30, 50]"
      class="pagination"
      show-size-picker
    />
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { useMessage } from "naive-ui";
import getInitials from "@/utils/getInitials";
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "UserList",
  components: {
    NavBar,
    Loader,
  },
  data() {
    return {
      users: null,
      loading: false,
      searchLoading: false,
      search: null,
      page: 1,
      limit: 10,
      pageCount: 1,
      debounce: null,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "userId", "currentUser"]),
  },
  methods: {
    async getUsers() {
      this.loading = true;
      const { search, page, limit } = this;

      const baseUrl = this.isLoggedIn ? "/users/authorized" : "/users";
      const queryString = new URLSearchParams({
        ...(search && { search }),
        page,
        limit,
      }).toString();

      return axios
        .get(baseUrl + "?" + queryString)
        .then((res) => {
          this.users = res.data?.data;
          this.pageCount = res.data?.pageCount;
          this.loading = false;
        })
        .catch(({ response }) => {
          if (response?.status === 401) {
            this.displayError("Unauthorized");
          } else {
            this.displayError("Unexpected error while fetching users");
          }
          this.loading = false;
        });
    },
    async handleAddFriendClick(id) {
      return axios
        .post(`users/${id}/friends`)
        .then(() => {
          this.getUsers();
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
    async handleRemoveFriendClick(id) {
      return axios
        .delete(`users/${id}/friends`)
        .then(() => {
          this.getUsers();
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
    isPending(user) {
      return user?.friendsRequest?.indexOf(this?.userId) >= 0;
    },
    isPendingAcceptance(user) {
      return this?.currentUser?.friendsRequest?.indexOf(user?._id) >= 0;
    },
    getInitials(user) {
      return getInitials(user);
    },
    searchUsers() {
      clearTimeout(this.debounce);
      this.searchLoading = true;
      this.debounce = setTimeout(() => {
        this.getUsers();
        this.searchLoading = false;
      }, 500);
    },
  },
  mounted() {
    this.getUsers();
  },
  watch: {
    limit() {
      this.getUsers();
    },
    page() {
      this.getUsers();
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
.user {
  min-width: 50%;
  margin: 1rem 0;
}

.search-bar,
.pagination {
  width: 80%;
  margin: 1rem 0;
}

@media (min-width: 979px) {
  .search-bar,
  .pagination {
    width: 50%;
  }
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

a {
  color: #42b983;
}

.reject-button {
  margin-right: 0.7rem;
}
</style>

<template>
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
            <n-badge dot color="green" :show="this.getUserStatus(user?._id)">
              <n-avatar class="avatar">
                {{ getInitials(user) }}
              </n-avatar>
            </n-badge>
            <router-link :to="{ name: 'User', params: { id: user?._id } }">
              {{ user?.first_name }}
              {{ user?.last_name }}
            </router-link>
          </n-space>
          <n-space>
            <n-button
              @click="() => emitRecipientId(user?._id)"
              icon-placement="right"
            >
              Chat
              <template #icon>
                <n-icon class="comment-icon" size="20">
                  <arrow-redo-outline />
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </n-space>
      </n-card>
    </div>
  </Loader>
  <div class="center">
    <n-pagination
      v-model:page="page"
      v-model:page-size="limit"
      v-model:page-count="pageCount"
      :page-sizes="[5, 8, 13]"
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
import Loader from "@/components/Loader.vue";
import { ArrowRedoOutline } from "@vicons/ionicons5";

export default {
  name: "UserList",
  components: {
    Loader,
    ArrowRedoOutline,
  },
  props: {
    activeUsers: Array,
  },
  emits: ["recipientId"],
  data() {
    return {
      users: null,
      loading: false,
      searchLoading: false,
      search: null,
      page: 1,
      limit: 5,
      pageCount: 1,
      debounce: null,
    };
  },
  computed: {
    ...mapGetters(["userId", "currentUser"]),
  },
  methods: {
    async getUsers() {
      this.loading = true;
      const { search, page, limit } = this;

      const baseUrl = "/users/friends";
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
    emitRecipientId(id) {
      this.$emit("recipientId", id);
    },
    getInitials(user) {
      return getInitials(user);
    },
    getUserStatus(userId) {
      return !!this.activeUsers?.find(
        (activeUserId) => activeUserId === userId
      );
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
  min-width: 90%;
  margin: 1rem 0;
}

.search-bar,
.pagination {
  width: 90%;
  margin: 1rem 0;
}

@media (min-width: 979px) {
  .search-bar,
  .pagination {
    width: 90%;
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

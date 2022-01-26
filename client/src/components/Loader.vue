<template>
  <div class="content-wrapper" v-if="content">
    <slot></slot>
  </div>
  <div class="content-wrapper" v-else>
    <template v-if="loading">
      <div class="content">
        <n-card>
          <template #header>
            <n-skeleton text width="50%" />
          </template>
          <n-skeleton text :repeat="1" />
        </n-card>
      </div>
    </template>
    <template v-else>
      <div class="content empty">
        <n-card class="empty">
          <n-empty :description="notFoundMessage" />
        </n-card>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: ["content", "loading", "notFoundMessage"],
};
</script>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  min-width: 50%;
  margin: 1rem 0;
}

.empty {
  padding: 6rem 0;
}
</style>

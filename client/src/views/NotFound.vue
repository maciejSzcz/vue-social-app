<template>
  <div class="center">
    <n-space justify="center">
      <n-result
        status="error"
        size="huge"
        title="Error"
        description="Page not found"
      >
        <template #footer>
          <router-link to="/">
            <n-button>Return to homepage</n-button>
          </router-link>
        </template>
      </n-result>
    </n-space>
  </div>
</template>
<script>
export default {
  name: "NotFound",
};
</script>
<style scoped>
.center {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

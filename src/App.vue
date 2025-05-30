<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { initializeAuth } = useAuth();

onMounted(async () => {
  // Initialize authentication on app start
  await initializeAuth();
});
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>

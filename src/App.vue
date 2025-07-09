<template>
  <div id="app">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import ToastContainer from "@/components/ui/ToastContainer.vue";

const { initializeAuth } = useAuth();

onMounted(async () => {
  await initializeAuth();
});
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>

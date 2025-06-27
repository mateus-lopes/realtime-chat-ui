<template>
  <div class="group inline-block" @click="toggleOnlineStatus">
    <div class="flex items-center gap-2 cursor-pointer">
      <span
        class="w-2 h-2 rounded-full transition group-hover:scale-150"
        :class="{
          'bg-emerald-500': isOnline,
          'bg-gray-500': !isOnline,
        }"
      ></span>
      <span class="text-white/60 text-sm">
        {{ isOnline ? "Online" : "Offline" }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
const isOnline = computed(() => authStore.isOnline);

function toggleOnlineStatus() {
  authStore.setOnlineStatus(!isOnline.value);
}
</script>

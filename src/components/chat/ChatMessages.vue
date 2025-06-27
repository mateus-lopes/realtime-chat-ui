<template>
  <div class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2 bg-black">
    <div
      v-for="msg in messages"
      :key="msg.id"
      :class="msg.from === user?._id ? 'self-end' : 'self-start'"
    >
      <div
        :class="[
          'rounded-xl px-4 py-2 max-w-md break-words',
          msg.from === user?._id
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            : 'bg-zinc-900 text-white/90',
        ]"
      >
        {{ msg.text }}
        <span class="block text-xs text-white/50 text-right mt-1">{{
          msg.time
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IChatMessage } from "@/types/chat.types";
import { useAuthStore } from "@/stores/auth.store";
import { computed } from "vue";

const authStore = useAuthStore();

const user = computed(() => authStore.user);

defineProps<{
  messages: IChatMessage[];
}>();
</script>

<style scoped>
.bg-wallpaper {
  background: linear-gradient(rgba(41, 42, 44, 0.85), rgba(0, 0, 0, 0.85));
  background-size: cover;
}
</style>

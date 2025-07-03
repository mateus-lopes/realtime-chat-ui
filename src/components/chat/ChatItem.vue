<template>
  <li
    class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-900 transition-colors"
  >
    <img :src="chat.avatar" alt="avatar" class="w-12 h-12 rounded-full" />
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <span class="text-white font-medium truncate">{{ chat.name }}</span>
        <span class="text-xs text-white/50">{{ chat.lastTime }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white/70 text-sm truncate">{{
          chat.lastMessage
        }}</span>
        <span
          v-if="chat.unread"
          class="ml-2 bg-green-500 text-xs text-white rounded-full px-2 py-0.5"
          >{{ chat.unread }}</span
        >
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { IChat } from "@/types/chat.types";

defineProps<{ chat: IChat }>();
</script>

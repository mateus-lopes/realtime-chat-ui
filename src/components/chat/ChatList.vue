<template>
  <div class="flex-1 overflow-y-auto">
    <ul>
      <ChatItem v-for="chat in chats" :key="chat.id" :chat="chat" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import ChatItem from "./ChatItem.vue";
import type { IChat } from "@/types/chat.types";

defineProps<{ chats: IChat[] }>();
</script>

<template>
  <section class="flex-1 flex flex-col h-full bg-black">
    <ChatHeader :contact="chat" />
    <ChatMessages :messages="chat.messages" />
    <ChatInput @send="onSend" />
  </section>
</template>

<script setup lang="ts">
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatInput from "./ChatInput.vue";
import type { IChat } from "@/types/chat.types";

defineProps<{ chat: IChat }>();
const emit = defineEmits(["send"]);
function onSend(msg: string) {
  emit("send", msg);
}
</script>

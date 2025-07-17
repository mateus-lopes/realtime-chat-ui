<template>
  <section class="flex-1 flex flex-col h-full bg-black">
    <ChatHeader :contact="chatStore.selectedUser" />
    <ChatMessages :messages="chatStore.messages" />
    <ChatInput @send="onSend" />
  </section>
</template>

<script setup lang="ts">
import ChatHeader from "./ChatHeader.vue";
import ChatMessages from "./ChatMessages.vue";
import ChatInput from "./ChatInput.vue";
import { useChatStore } from "@/stores/chat.store";

const chatStore = useChatStore();
const emit = defineEmits(["send"]);

function onSend(msg: string) {
  emit("send", msg);
}
</script>

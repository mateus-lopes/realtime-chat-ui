<template>
  <header
    class="flex items-center gap-4 px-6 py-4 border-b border-zinc-700 bg-black"
  >
    <img
      v-if="chatStore.selectedUser.profilePicture"
      :src="chatStore.selectedUser.profilePicture"
      alt="avatar"
      class="w-10 h-10 rounded-full"
    />
    <div
      v-else
      class="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center overflow-hidden"
    >
      <span class="text-white font-semibold">
        {{ avatarInitials }}
      </span>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-white font-semibold truncate">{{
          chatStore.selectedUser.fullName
        }}</span>
        <span
          class="text-xs lowercase"
          :class="
            chatStore.selectedUser.isOnline ? 'text-green-500' : 'text-gray-300'
          "
          >{{ chatStore.selectedUser.isOnline ? "online" : "offline" }}</span
        >
      </div>
    </div>
    <div class="flex gap-2">
      <button class="p-2 rounded-full hover:bg-zinc-950 text-white/70">
        <span class="material-symbols-outlined">search</span>
      </button>
      <button class="p-2 rounded-full hover:bg-zinc-950 text-white/70">
        <span class="material-symbols-outlined">more_vert</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import { computed } from "vue";

const chatStore = useChatStore();

const avatarInitials = computed(() => {
  const nameParts = chatStore.selectedUser.fullName.split(" ");
  return nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
});
</script>

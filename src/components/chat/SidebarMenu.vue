<template>
  <aside class="w-80 bg-black flex flex-col h-full border-r border-zinc-800">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl">Chats</h2>
      </div>
      <div class="flex gap-2">
        <button
          class="p-2 rounded-full hover:bg-zinc-950 text-white/70 transition-colors"
        >
          <span class="material-symbols-outlined">new_window</span>
        </button>
        <button
          class="p-2 rounded-full hover:bg-zinc-950 text-white/70 transition-colors"
        >
          <span class="material-symbols-outlined">filter_list</span>
        </button>
      </div>
    </div>
    <div class="p-3">
      <input
        type="text"
        placeholder="Buscar ou iniciar nova conversa"
        class="w-full bg-zinc-900 text-white/80 rounded-lg px-4 py-2 focus:outline-none"
      />
    </div>
    <ChatList :chats="chats" />
  </aside>
</template>

<script setup lang="ts">
import ChatList from "./ChatList.vue";
import type { IChat } from "@/types/chat.types";
import type { User } from "@/types/auth.types";

defineProps<{ user: User; chats: IChat[] }>();
</script>

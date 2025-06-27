<template>
  <header
    class="flex items-center gap-4 px-6 py-4 border-b border-zinc-800 bg-black"
  >
    <img :src="contact.avatar" alt="avatar" class="w-10 h-10 rounded-full" />
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-white font-semibold truncate">{{
          contact.name
        }}</span>
        <span class="text-xs text-green-400 lowercase">{{
          contact.status
        }}</span>
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
defineProps({
  contact: {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "online",
    },
  },
});
</script>

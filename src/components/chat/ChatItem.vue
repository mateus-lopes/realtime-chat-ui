<template>
  <li
    class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-900 transition-colors"
  >
    <img
      :src="user.profilePicture"
      alt="avatar"
      class="w-12 h-12 rounded-full"
    />
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <span class="text-white font-medium truncate">{{ user.fullName }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white/70 text-sm truncate">{{
          user.isOnline ? "Online" : "Offline"
        }}</span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { IUser } from "@/types/auth.types";

defineProps<{ user: IUser }>();
</script>

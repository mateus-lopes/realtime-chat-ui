<template>
  <li
    class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-zinc-900 transition-colors"
  >
    <img
      v-if="user.profilePicture"
      :src="user.profilePicture"
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
import { computed } from "vue";

const props = defineProps<{ user: IUser }>();

const avatarInitials = computed(() => {
  const names = props.user.fullName.split(" ");
  return names.length > 1
    ? names[0][0] + names[names.length - 1][0]
    : names[0][0];
});
</script>

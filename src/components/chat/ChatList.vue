<template>
  <div class="flex-1 overflow-y-auto">
    <ul>
      <ChatItem
        v-for="user in users"
        :key="user._id"
        :user="user"
        @click="emit('selectChat', user._id)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { IUser } from "@/types/auth.types";
import ChatItem from "./ChatItem.vue";

defineProps<{ users: IUser[] }>();

const emit = defineEmits<{
  (e: "selectChat", userId: string): void;
}>();
</script>

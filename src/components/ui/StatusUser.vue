<template>
  <div
    class="group inline-block"
    @click="toggleOnlineStatus"
    :class="{ 'pointer-events-none opacity-50': isUpdating }"
  >
    <div class="flex items-center gap-2 cursor-pointer">
      <span
        class="w-2 h-2 rounded-full transition group-hover:scale-150"
        :class="{
          'bg-emerald-500': isOnline && !isUpdating,
          'bg-gray-500': !isOnline && !isUpdating,
          'bg-yellow-500 animate-pulse': isUpdating,
        }"
      ></span>
      <span class="text-white/60 text-sm">
        {{ isUpdating ? "Atualizando..." : isOnline ? "Online" : "Offline" }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/composables/useToast";

const authStore = useAuthStore();
const { error } = useToast();
const isOnline = computed(() => authStore.isOnline);
const isUpdating = ref(false);

async function toggleOnlineStatus() {
  if (isUpdating.value) return;

  const newStatus = !isOnline.value;
  isUpdating.value = true;

  try {
    await authStore.setOnlineStatus(newStatus);
  } catch (err: any) {
    error(
      "Erro ao atualizar status",
      "Não foi possível alterar seu status online"
    );
  } finally {
    isUpdating.value = false;
  }
}
</script>

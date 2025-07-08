<template>
  <div class="flex h-screen bg-black">
    <div
      class="bg-black border-r border-zinc-700 transition-all duration-300 ease-in-out flex flex-col"
      :class="[isExpanded ? 'w-64' : 'w-16']"
    >
      <!-- isExpanded ? 'absolute inset-y-0 left-0 z-50' : '', -->
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div v-if="isExpanded" class="flex items-center gap-3">
            <UserProfileDropdown
              @editProfile="handleEditProfile"
              @settings="handleSettings"
              @starredMessages="handleStarredMessages"
            />
            <span class="text-white font-semibold">
              {{ displayUserName }}
            </span>
          </div>

          <div v-else class="flex justify-center w-full">
            <UserProfileDropdown
              @editProfile="handleEditProfile"
              @settings="handleSettings"
              @starredMessages="handleStarredMessages"
            />
          </div>
        </div>
      </div>

      <nav class="flex-1 p-2 space-y-1">
        <button
          @click="setActiveSection('chats')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'chats'
              ? 'bg-zinc-700 text-white'
              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
          "
        >
          <div class="relative">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div
              v-if="unreadChats > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span class="text-xs text-white font-bold">{{
                unreadChats > 9 ? "9+" : unreadChats
              }}</span>
            </div>
          </div>
          <span v-if="isExpanded" class="font-medium">Conversas</span>
        </button>

        <button
          @click="setActiveSection('status')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'status'
              ? 'bg-zinc-700 text-white'
              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
          "
        >
          <div class="relative">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <div
              v-if="newStatus"
              class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
            ></div>
          </div>
          <span v-if="isExpanded" class="font-medium">Status</span>
        </button>

        <button
          @click="setActiveSection('channels')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'channels'
              ? 'bg-zinc-700 text-white'
              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
          "
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
            />
          </svg>
          <span v-if="isExpanded" class="font-medium">Canais</span>
        </button>

        <button
          @click="setActiveSection('communities')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'communities'
              ? 'bg-zinc-700 text-white'
              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
          "
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span v-if="isExpanded" class="font-medium">Comunidades</span>
        </button>

        <div class="border-t border-zinc-700 my-4"></div>

        <button
          @click="setActiveSection('starred')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'starred'
              ? 'bg-zinc-700 text-white'
              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
          "
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          <span v-if="isExpanded" class="font-medium">Favoritas</span>
        </button>

        <button
          @click="setActiveSection('archived')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'archived'
              ? 'bg-zinc-700 text-white'
              : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
          "
        >
          <div class="relative">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8l6 6 6-6"
              />
            </svg>
            <div
              v-if="archivedCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center"
            >
              <span class="text-xs text-white font-bold">{{
                archivedCount > 9 ? "9+" : archivedCount
              }}</span>
            </div>
          </div>
          <span v-if="isExpanded" class="font-medium">Arquivadas</span>
        </button>
      </nav>

      <div class="p-2 flex justify-end">
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
        >
          <svg
            class="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            v-if="!isExpanded"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <svg
            class="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            v-if="isExpanded"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <slot :activeSection="activeSection" :toggleSidebar="toggleSidebar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import UserProfileDropdown from "@/components/user/UserProfileDropdown.vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

const isExpanded = ref(false);
const activeSection = ref("chats");

const unreadChats = ref(3);
const newStatus = ref(true);
const archivedCount = ref(2);

const displayUserName = computed(() => {
  if (!authStore.userName) return "";
  const names = authStore.userName.split(" ");
  return names.slice(0, 2).join(" ");
});

const emit = defineEmits<{
  sectionChange: [section: string];
}>();

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const setActiveSection = (section: string) => {
  activeSection.value = section;
  emit("sectionChange", section);
};

const handleEditProfile = () => {
  setActiveSection("profile");
};

const handleSettings = () => {
  setActiveSection("settings");
};

const handleStarredMessages = () => {
  setActiveSection("starred");
};
</script>

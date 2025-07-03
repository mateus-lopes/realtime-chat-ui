<template>
  <div class="flex h-screen bg-black">
    <!-- Sidebar -->
    <div
      class="bg-zinc-900 border-r border-gray-700 transition-all duration-300 ease-in-out flex flex-col"
      :class="[
        isExpanded ? 'w-64' : 'w-16',
        isMobile && isExpanded ? 'absolute inset-y-0 left-0 z-50' : '',
      ]"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <div v-if="isExpanded" class="flex items-center gap-3">
            <UserProfileDropdown
              @editProfile="handleEditProfile"
              @settings="handleSettings"
              @starredMessages="handleStarredMessages"
            />
            <span class="text-white font-semibold">
              {{ authStore.userName }}
            </span>
          </div>

          <div v-else class="flex justify-center w-full">
            <UserProfileDropdown
              @editProfile="handleEditProfile"
              @settings="handleSettings"
              @starredMessages="handleStarredMessages"
            />
          </div>

          <button
            v-if="isExpanded"
            @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              class="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 space-y-1">
        <!-- Chats -->
        <button
          @click="setActiveSection('chats')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'chats'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

        <!-- Status -->
        <button
          @click="setActiveSection('status')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'status'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

        <!-- Channels -->
        <button
          @click="setActiveSection('channels')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'channels'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

        <!-- Communities -->
        <button
          @click="setActiveSection('communities')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'communities'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

        <!-- Divider -->
        <div class="border-t border-gray-700 my-4"></div>

        <!-- Starred Messages -->
        <button
          @click="setActiveSection('starred')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'starred'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          "
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          <span v-if="isExpanded" class="font-medium">Favoritas</span>
        </button>

        <!-- Archived -->
        <button
          @click="setActiveSection('archived')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'archived'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

      <!-- Footer -->
      <div class="p-2 border-t border-gray-700">
        <!-- Settings -->
        <button
          @click="setActiveSection('settings')"
          class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
          :class="
            activeSection === 'settings'
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span v-if="isExpanded" class="font-medium">Configurações</span>
        </button>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isMobile && isExpanded"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <slot :activeSection="activeSection" :toggleSidebar="toggleSidebar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import UserProfileDropdown from "@/components/user/UserProfileDropdown.vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

const isExpanded = ref(true);
const activeSection = ref("chats");
const isMobile = ref(false);

// Mock data
const unreadChats = ref(3);
const newStatus = ref(true);
const archivedCount = ref(2);

const emit = defineEmits<{
  sectionChange: [section: string];
}>();

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const closeSidebar = () => {
  if (isMobile.value) {
    isExpanded.value = false;
  }
};

const setActiveSection = (section: string) => {
  activeSection.value = section;
  emit("sectionChange", section);

  if (isMobile.value) {
    isExpanded.value = false;
  }
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

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    isExpanded.value = true;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

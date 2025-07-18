<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:opacity-80 transition-colors duration-200"
      :class="{ 'border-green-500': isOnline }"
    >
      <img
        v-if="userAvatar"
        :src="userAvatar"
        :alt="userName"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-medium text-sm"
      >
        {{ userInitials }}
      </div>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-2 w-80 bg-zinc-950 rounded-lg shadow-xl border border-zinc-700 z-50 overflow-hidden"
      >
        <!-- Profile Header -->
        <div
          class="p-6 bg-gradient-to-r from-green-950 via-blue-950 to-zinc-800"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-500"
            >
              <img
                v-if="userAvatar"
                :src="userAvatar"
                :alt="userName"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-medium text-lg"
              >
                {{ userInitials }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-white font-semibold text-lg truncate">
                {{ userName }}
              </h3>
              <p class="text-gray-300 text-sm truncate">{{ userEmail }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-green-400 text-xs">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 space-y-4">
          <div class="space-y-2">
            <button
              @click="handleEditProfile"
              class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors duration-150 text-left"
            >
              <div
                class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <div class="text-gray-200 font-medium">Editar perfil</div>
                <div class="text-gray-400 text-xs">
                  Alterar nome, foto e descrição
                </div>
              </div>
            </button>

            <button
              @click="handleStarredMessages"
              class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors duration-150 text-left"
            >
              <div
                class="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <div>
                <div class="text-gray-200 font-medium">Mensagens favoritas</div>
                <div class="text-gray-400 text-xs">Ver mensagens marcadas</div>
              </div>
            </button>
          </div>

          <div class="border-t border-zinc-700 my-4"></div>

          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/20 transition-colors duration-150 text-left border border-red-500/20 hover:border-red-500/40"
          >
            <div
              class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <div>
              <div class="text-red-400 font-medium">Sair da conta</div>
              <div class="text-red-500/70 text-xs">
                Fazer logout do aplicativo
              </div>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/composables/useAuth";

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

const authStore = useAuthStore();
const { logout } = useAuth();

const userName = computed(() => authStore.userName || "Usuário");
const userEmail = computed(() => authStore.userEmail || "email@exemplo.com");
const userAvatar = computed(() => authStore.userAvatar);
const isOnline = computed(() => authStore.isOnline || false);

const userInitials = computed(() => {
  return userName.value
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const emit = defineEmits<{
  editProfile: [];
  settings: [];
  starredMessages: [];
}>();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleEditProfile = () => {
  emit("editProfile");
  closeDropdown();
};

const handleStarredMessages = () => {
  emit("starredMessages");
  closeDropdown();
};

const handleLogout = async () => {
  try {
    await logout();
    closeDropdown();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

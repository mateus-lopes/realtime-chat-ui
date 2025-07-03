<template>
  <div class="bg-black p-4">
    <div class="mx-auto max-w-2xl">
      <!-- Profile Card -->
      <main
        class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 flex flex-col items-start gap-6"
      >
        <button
          @click="$emit('close')"
          class="fixed left-6 top-6 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <svg
            class="w-6 h-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <!-- User Avatar -->
        <div class="flex flex-col items-center w-full gap-4">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-500"
            >
              <img
                v-if="userAvatar"
                :src="userAvatar"
                :alt="userName"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gray-600 flex items-center justify-center text-white font-medium text-2xl"
              >
                {{ userInitials }}
              </div>
            </div>
            <button
              @click="handleChangeAvatar"
              class="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-200"
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <!-- Status Indicator -->
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-green-400 text-sm">Online</span>
          </div>
        </div>

        <!-- User Info -->
        <div class="w-full space-y-4">
          <!-- Name -->
          <div class="space-y-2">
            <label class="text-white/70 text-xs">Nome</label>
            <div class="flex items-center gap-2">
              <input
                v-if="editingName"
                v-model="tempName"
                @blur="saveName"
                @keydown.enter="saveName"
                @keydown.escape="cancelEditName"
                class="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                ref="nameInput"
              />
              <p v-else class="flex-1 text-white text-lg">{{ userName }}</p>
              <button
                @click="startEditName"
                class="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
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
              </button>
            </div>
          </div>

          <!-- About -->
          <div class="space-y-2">
            <label class="text-white/70 text-xs">Sobre</label>
            <div class="flex items-start gap-2">
              <textarea
                v-if="editingAbout"
                v-model="tempAbout"
                @blur="saveAbout"
                @keydown.enter.exact="saveAbout"
                @keydown.escape="cancelEditAbout"
                class="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows="3"
                ref="aboutInput"
              ></textarea>
              <p v-else class="flex-1 text-white">
                {{ userAbout || "Adicione uma descrição..." }}
              </p>
              <button
                @click="startEditAbout"
                class="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 mt-1"
              >
                <svg
                  class="w-4 h-4 text-gray-400"
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
              </button>
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="text-white/70 text-xs">Email</label>
            <p class="text-white">{{ userEmail }}</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full border-t border-white/10"></div>

        <!-- Actions -->
        <div class="w-full space-y-3">
          <button
            @click="handleSettings"
            class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-150 text-left"
          >
            <div
              class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span class="text-gray-200 font-medium">Configurações</span>
          </button>

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
            <span class="text-red-400 font-medium">Sair da conta</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/composables/useAuth";

const authStore = useAuthStore();
const { logout } = useAuth();

const editingName = ref(false);
const editingAbout = ref(false);
const tempName = ref("");
const tempAbout = ref("");
const nameInput = ref<HTMLInputElement>();
const aboutInput = ref<HTMLTextAreaElement>();

const userName = computed(() => authStore.userName || "Usuário");
const userEmail = computed(() => authStore.userEmail || "email@exemplo.com");
const userAvatar = computed(() => authStore.userAvatar);
const userAbout = computed(() => authStore.userAbout || "");

const userInitials = computed(() => {
  return userName.value
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const emit = defineEmits<{
  close: [];
  settings: [];
}>();

const startEditName = async () => {
  editingName.value = true;
  tempName.value = userName.value;
  await nextTick();
  nameInput.value?.focus();
};

const saveName = () => {
  if (tempName.value.trim()) {
    // Aqui você salvaria no store/backend
    console.log("Salvando nome:", tempName.value);
  }
  editingName.value = false;
};

const cancelEditName = () => {
  editingName.value = false;
  tempName.value = "";
};

const startEditAbout = async () => {
  editingAbout.value = true;
  tempAbout.value = userAbout.value;
  await nextTick();
  aboutInput.value?.focus();
};

const saveAbout = () => {
  // Aqui você salvaria no store/backend
  console.log("Salvando sobre:", tempAbout.value);
  editingAbout.value = false;
};

const cancelEditAbout = () => {
  editingAbout.value = false;
  tempAbout.value = "";
};

const handleChangeAvatar = () => {
  // Implementar upload de avatar
  console.log("Mudando avatar...");
};

const handleSettings = () => {
  emit("settings");
};

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};
</script>

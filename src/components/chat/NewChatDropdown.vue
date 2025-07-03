<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="p-2 flex items-center justify-center rounded-lg bg-black hover:bg-zinc-900 transition-colors duration-200"
      :class="{ 'bg-zinc-900': isOpen }"
    >
      <svg
        class="w-5 h-5 text-zinc-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 top-full mt-2 w-64 bg-black rounded-lg shadow-xl border border-zinc-900 z-50"
      >
        <div>
          <!-- New Group -->
          <button
            @click="handleNewGroup"
            class="w-full px-4 py-3 text-left hover:bg-zinc-900 transition-colors duration-150 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <div class="text-zinc-200 font-medium">Novo grupo</div>
              <div class="text-zinc-400 text-sm">
                Criar um grupo de conversa
              </div>
            </div>
          </button>

          <!-- New Contact -->
          <button
            @click="handleNewContact"
            class="w-full px-4 py-3 text-left hover:bg-zinc-900 transition-colors duration-150 flex items-center gap-3"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <div class="text-zinc-200 font-medium">Novo contato</div>
              <div class="text-zinc-400 text-sm">Adicionar um novo contato</div>
            </div>
          </button>

          <!-- Divider -->
          <div class="border-t border-zinc-900"></div>

          <!-- New Community -->
          <button
            @click="handleNewCommunity"
            class="w-full px-4 py-3 text-left hover:bg-zinc-900 transition-colors duration-150 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <div class="text-zinc-200 font-medium">Nova comunidade</div>
              <div class="text-zinc-400 text-sm">Criar uma comunidade</div>
            </div>
          </button>

          <!-- Starred Messages -->
          <button
            @click="handleStarredMessages"
            class="w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors duration-150 flex items-center gap-3"
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
              <div class="text-zinc-200 font-medium">Mensagens favoritas</div>
              <div class="text-zinc-400 text-sm">Ver mensagens marcadas</div>
            </div>
          </button>

          <!-- Settings -->
          <button
            @click="handleSettings"
            class="w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors duration-150 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center"
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
            <div>
              <div class="text-zinc-200 font-medium">Configurações</div>
              <div class="text-zinc-400 text-sm">Preferências do app</div>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

const emit = defineEmits<{
  newGroup: [];
  newContact: [];
  newCommunity: [];
  starredMessages: [];
  settings: [];
}>();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleNewGroup = () => {
  emit("newGroup");
  closeDropdown();
};

const handleNewContact = () => {
  emit("newContact");
  closeDropdown();
};

const handleNewCommunity = () => {
  emit("newCommunity");
  closeDropdown();
};

const handleStarredMessages = () => {
  emit("starredMessages");
  closeDropdown();
};

const handleSettings = () => {
  emit("settings");
  closeDropdown();
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

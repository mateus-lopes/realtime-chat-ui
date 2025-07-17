<template>
  <aside class="w-80 bg-black flex flex-col h-full border-r border-zinc-700">
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl">Chats</h2>
      </div>
      <div class="flex gap-2">
        <NewChatDropdown
          @newGroup="handleNewGroup"
          @newContact="handleNewContact"
          @newCommunity="handleNewCommunity"
          @starredMessages="handleStarredMessages"
          @settings="handleSettings"
        />
        <!-- <button
          class="p-2 rounded-full hover:bg-zinc-950 text-white/70 transition-colors"
        >
          <span class="material-symbols-outlined">filter_list</span>
        </button> -->
      </div>
    </div>
    <div class="p-3">
      <ChatSearchDropdown
        @search="handleSearch"
        @selectResult="handleSelectResult"
        @searchOption="handleSearchOption"
      />
    </div>
    <div v-if="chatStore.isUserLoading">CARREGANDO...</div>
    <ChatList
      :users="chatStore.users"
      v-else
      @selectChat="chatStore.selectChat"
    />
  </aside>
</template>

<script setup lang="ts">
import ChatList from "../chat/ChatList.vue";
import NewChatDropdown from "../chat/NewChatDropdown.vue";
import ChatSearchDropdown from "../chat/ChatSearchDropdown.vue";
import { useChatStore } from "@/stores/chat.store";

const chatStore = useChatStore();

const handleNewGroup = () => {
  console.log("Criar novo grupo");
};

const handleNewContact = () => {
  console.log("Adicionar novo contato");
};

const handleNewCommunity = () => {
  console.log("Criar nova comunidade");
};

const handleStarredMessages = () => {
  console.log("Ver mensagens favoritas");
};

const handleSettings = () => {
  console.log("Abrir configurações");
};

const handleSearch = (query: string, type?: string) => {
  console.log("Buscar:", query, type);
};

const handleSelectResult = (result: any) => {
  console.log("Resultado selecionado:", result);
};

const handleSearchOption = (type: string) => {
  console.log("Opção de busca:", type);
};
</script>

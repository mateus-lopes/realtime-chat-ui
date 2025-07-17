<template>
  <SideMenu @sectionChange="handleSectionChange">
    <template #default="{ activeSection }">
      <!-- Chat Section -->
      <div
        v-if="activeSection === 'chats'"
        class="flex h-screen bg-gradient-to-b from-[#020917] to-[#101725]"
      >
        <SidebarMenu v-if="chatStore.users" @selectChat="selectChat" />
        <ChatArea
          v-if="chatStore.selectedUser._id"
          :chat="chatStore.selectedUser"
          :messages="chatStore.messages"
          :user="chatStore.selectedUser"
          @sendMessage="sendMessage"
        />
        <div
          v-else
          class="flex-1 flex items-center justify-center text-white/60 text-lg bg-black"
        >
          <div>
            <p>Selecione uma conversa para começar a conversar!</p>
          </div>
        </div>
      </div>

      <UserProfile
        v-else-if="activeSection === 'profile'"
        @close="handleSectionChange('chats')"
        @settings="handleSectionChange('settings')"
      />

      <div
        v-else
        class="flex-1 flex items-center justify-center bg-black text-white/90 text-lg"
      >
        <div class="text-center">
          <h2 class="text-2xl font-semibold mb-2">
            {{ getSectionTitle(activeSection) }}
          </h2>
          <p>Esta seção está em desenvolvimento</p>
        </div>
      </div>
    </template>
  </SideMenu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import SideMenu from "@/components/layout/SideMenu.vue";
import SidebarMenu from "@/components/layout/SidebarMenu.vue";
import ChatArea from "@/components/chat/ChatArea.vue";
import UserProfile from "@/components/user/UserProfile.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useChatStore } from "@/stores/chat.store";

const authStore = useAuthStore();
const chatStore = useChatStore();

const user = computed(() => authStore.user);
// Mock chats
const chats = ref([
  {
    id: 1,
    name: "João Silva",
    avatar:
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    lastMessage: "Olá! Como você está?",
    lastTime: "14:30",
    unread: 2,
    messages: [
      {
        id: 1,
        from: "João Silva",
        text: "Olá! Como você está?",
        time: "14:30",
        sent: false,
      },
      {
        id: 2,
        from: "Mateus Lopes",
        text: "Oi! Estou bem, obrigado! E você?",
        time: "14:32",
        sent: true,
      },
      {
        id: 3,
        from: "João Silva",
        text: "Também estou bem! Que bom ver você por aqui 😊",
        time: "14:33",
        sent: false,
      },
      {
        id: 4,
        from: "Mateus Lopes",
        text: "Sim! Este app está ficando muito bom. Parabéns pelo trabalho!",
        time: "14:35",
        sent: true,
      },
      {
        id: 5,
        from: "João Silva",
        text: "Obrigado! Ainda estamos desenvolvendo mais funcionalidades. Em breve teremos muito mais!",
        time: "14:36",
        sent: false,
      },
    ],
  },
  {
    id: 2,
    name: "Maria Fernanda",
    avatar:
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    lastMessage: "Perfeito! Vamos marcar para amanhã então",
    lastTime: "13:45",
    unread: 0,
    messages: [],
  },
  {
    id: 3,
    name: "Time ChatApp",
    avatar:
      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    lastMessage: "Bem-vindo ao ChatApp! 🎉",
    lastTime: "12:15",
    unread: 0,
    messages: [],
  },
]);

const selectedChatId = ref(chats.value[0]?.id || null);
const selectedChat = computed(() =>
  chats.value.find((c) => c.id === selectedChatId.value)
);

function selectChat(id: number) {
  selectedChatId.value = id;
}

function sendMessage(message: string) {
  if (!selectedChat.value || !user.value) return;
  selectedChat.value.messages.push({
    id: Date.now(),
    from: user.value.fullName,
    text: message,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    sent: true,
  });
}

function handleSectionChange(section: string) {
  console.log("Mudando para seção:", section);
}

function getSectionTitle(section: string) {
  const titles: Record<string, string> = {
    chats: "Conversas",
    status: "Status",
    channels: "Canais",
    communities: "Comunidades",
    starred: "Mensagens Favoritas",
    archived: "Conversas Arquivadas",
    settings: "Configurações",
    profile: "Perfil",
  };
  return titles[section] || "Seção";
}

onMounted(() => {
  chatStore.getUsers();
});
</script>

<style scoped>
.chat-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #020917, #101725);
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.chat-sidebar {
  width: 350px;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.sidebar-header {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details h3 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.user-details .status {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-bar {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.search-input svg {
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.search-input input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.875rem;
  outline: none;
}

.search-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.conversation-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.conversation-item.active {
  background: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #3b82f6;
}

.conversation-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.conversation-header h4 {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-header .time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.conversation-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-preview p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.unread-count {
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  min-width: 20px;
  text-align: center;
  flex-shrink: 0;
}

/* Chat Main */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-only {
  display: none;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.contact-details h3 {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.contact-details .status {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.messages-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-image: radial-gradient(
      circle at 20% 80%,
      rgba(59, 130, 246, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(16, 185, 129, 0.05) 0%,
      transparent 50%
    );
}

.date-divider {
  text-align: center;
  margin: 1rem 0;
}

.date-divider span {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.message {
  display: flex;
  max-width: 70%;
  margin-bottom: 0.25rem;
}

.message-received {
  align-self: flex-start;
}

.message-sent {
  align-self: flex-end;
}

.message-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message-sent .message-content {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.message-content p {
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  float: right;
}

.message-input {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.attachment-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.attachment-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
}

.input-container input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.875rem;
  outline: none;
  margin-right: 0.5rem;
}

.input-container input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.emoji-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.send-btn {
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .chat-view {
    flex-direction: column;
  }

  .chat-sidebar {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .chat-main {
    width: 100%;
  }

  .message {
    max-width: 85%;
  }

  .message-input {
    padding: 0.75rem;
  }

  .attachment-btn,
  .send-btn {
    width: 40px;
    height: 40px;
  }
}

/* Scrollbar customization */
.conversations-list::-webkit-scrollbar,
.messages-area::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-area::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-area::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

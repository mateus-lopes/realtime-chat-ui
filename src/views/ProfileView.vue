<template>
  <div class="profile-view">
    <div class="profile-container">
      <header class="profile-header">
        <button @click="goBack" class="back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
            />
          </svg>
        </button>
        <h1 class="profile-title">Perfil</h1>
      </header>

      <main class="profile-main">
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar" v-if="!userAvatar">
              <span class="avatar-text">{{ avatarInitials }}</span>
            </div>
            <div class="avatar-image" v-else>
              <img :src="userAvatar" :alt="userName" />
            </div>
            <button
              class="change-avatar-btn"
              @click="showImageUpload = !showImageUpload"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="currentColor"
                  d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z"
                />
              </svg>
              {{ userAvatar ? "Alterar Foto" : "Adicionar Foto" }}
            </button>
          </div>

          <div v-if="showImageUpload" class="image-upload-section">
            <h3>Alterar Foto de Perfil</h3>
            <ImageUpload
              v-model="newProfilePicture"
              @upload="handleImageUpload"
              @remove="handleImageRemove"
              :max-size="2"
            />
            <div class="upload-actions">
              <MobileButton
                variant="primary"
                size="sm"
                :loading="uploadingImage"
                :disabled="!newProfilePicture || uploadingImage"
                @click="saveProfilePicture"
              >
                Salvar Foto
              </MobileButton>
              <MobileButton
                variant="ghost"
                size="sm"
                @click="cancelImageUpload"
                :disabled="uploadingImage"
              >
                Cancelar
              </MobileButton>
            </div>
          </div>

          <div class="user-info">
            <h2 class="user-name">{{ userName }}</h2>
            <p class="user-email">{{ userEmail }}</p>
            <div class="status-indicator">
              <span class="status-dot" :class="{ online: isOnline }"></span>
              <span class="status-text">{{
                isOnline ? "Online" : "Offline"
              }}</span>
            </div>
          </div>
        </div>

        <div class="profile-sections">
          <div class="section">
            <h3 class="section-title">Informações Pessoais</h3>
            <div class="section-content">
              <div class="info-item">
                <span class="info-label">Nome</span>
                <span class="info-value">{{ userName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">E-mail</span>
                <span class="info-value">{{ userEmail }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Membro desde</span>
                <span class="info-value">Janeiro 2024</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Configurações</h3>
            <div class="section-content">
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Notificações</span>
                  <span class="setting-description"
                    >Receber notificações de mensagens</span
                  >
                </div>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Som</span>
                  <span class="setting-description"
                    >Reproduzir som ao receber mensagens</span
                  >
                </div>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Modo Escuro</span>
                  <span class="setting-description"
                    >Usar tema escuro (sempre ativo)</span
                  >
                </div>
                <label class="toggle">
                  <input type="checkbox" checked disabled />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Ações</h3>
            <div class="section-content">
              <button class="action-btn edit-btn">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
                Editar Perfil
              </button>

              <button class="action-btn security-btn">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"
                  />
                </svg>
                Alterar Senha
              </button>

              <button class="action-btn danger-btn" @click="handleLogout">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
                  />
                </svg>
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import authService from "@/services/auth.service";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import MobileButton from "@/components/ui/MobileButton.vue";

const router = useRouter();
const { userName, userEmail, userAvatar, isOnline, logout, requireAuth } =
  useAuth();

// Image upload state
const showImageUpload = ref(false);
const newProfilePicture = ref("");
const uploadingImage = ref(false);

const avatarInitials = computed(() => {
  const name = userName.value || "User";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

onMounted(() => {
  requireAuth();
});

const goBack = () => {
  router.back();
};

const handleLogout = async () => {
  if (confirm("Tem certeza que deseja sair da sua conta?")) {
    await logout();
  }
};

// Image upload handlers
const handleImageUpload = (file: File) => {
  console.log("Image uploaded:", file);
};

const handleImageRemove = () => {
  newProfilePicture.value = "";
};

const saveProfilePicture = async () => {
  if (!newProfilePicture.value) return;

  uploadingImage.value = true;
  try {
    await authService.updateProfile({
      profilePicture: newProfilePicture.value,
      userId: "current-user-id", // This should come from the user store
    });

    showImageUpload.value = false;
    newProfilePicture.value = "";
  } catch (error) {
    console.error("Failed to update profile picture:", error);
    alert("Erro ao atualizar foto de perfil");
  } finally {
    uploadingImage.value = false;
  }
};

const cancelImageUpload = () => {
  showImageUpload.value = false;
  newProfilePicture.value = "";
};
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #020917, #101725);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 2rem;
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

.profile-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.avatar-section {
  margin-bottom: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.avatar-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.change-avatar-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.change-avatar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-upload-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
}

.image-upload-section h3 {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.user-info {
  text-align: center;
}

.user-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.user-email {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  transition: background 0.2s ease;
}

.status-dot.online {
  background: #10b981;
}

.status-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
}

.section-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.info-value {
  color: white;
  font-weight: 500;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.setting-info {
  flex: 1;
}

.setting-label {
  color: white;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;
}

.setting-description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.2s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: #3b82f6;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.danger-btn {
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.danger-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .profile-container {
    padding: 0.5rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .avatar {
    width: 60px;
    height: 60px;
  }

  .avatar-text {
    font-size: 1.25rem;
  }

  .user-name {
    font-size: 1.25rem;
  }

  .section {
    padding: 1rem;
  }

  .info-item,
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .setting-item {
    align-items: stretch;
  }

  .toggle {
    align-self: flex-end;
  }
}
</style>

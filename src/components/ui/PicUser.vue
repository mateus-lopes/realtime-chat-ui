<template>
  <div class="inline-block">
    <div @mouseenter="avatarHover = true" @mouseleave="avatarHover = false">
      <div
        v-if="!userAvatar"
        class="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center mb-4 shadow-lg overflow-hidden"
      >
        <span class="text-white text-2xl font-semibold">
          {{ avatarInitials }}
        </span>
        <div
          v-if="avatarHover"
          class="absolute bg-slate-900/40 bottom-0 right-0 text-white w-full h-full text-base cursor-pointer flex items-center justify-center transition z-28"
          @click="showImageUpload = true"
          title="Editar foto"
        >
          <span class="material-symbols-outlined text-xs!"> edit </span>
        </div>
      </div>
      <div
        v-else
        class="relative w-28 h-28 rounded-full mb-4 overflow-hidden shadow-lg"
      >
        <img
          :src="userAvatar"
          :alt="userName"
          class="w-full h-full object-cover max-w-30 max-h-30 block"
        />
        <div
          v-if="avatarHover"
          class="absolute bg-slate-900/40 bottom-0 right-0 text-white w-full h-full text-base cursor-pointer flex items-center justify-center transition z-28"
          @click="showImageUpload = true"
          title="Editar foto"
        >
          <span class="material-symbols-outlined text-xs!"> edit </span>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div
        v-if="showImageUpload"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50"
      >
        <div
          class="bg-[#181f2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-xl relative"
        >
          <h3 class="text-white text-lg font-semibold mb-4 text-center">
            Alterar Foto de Perfil
          </h3>
          <ImageUpload
            v-model="newProfilePicture"
            @upload="handleImageUpload"
            @remove="handleImageRemove"
            :max-size="2"
          />
          <div class="flex gap-4 mt-4 justify-center">
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
          <button
            class="absolute top-2 right-2 text-white/60 hover:text-white text-xl"
            @click="cancelImageUpload"
            :disabled="uploadingImage"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import authService from "@/services/auth.service";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import MobileButton from "@/components/ui/MobileButton.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const userName = computed(() => user.value?.fullName || "User");
const userAvatar = computed(() => authStore.userAvatar);

const showImageUpload = ref(false);
const newProfilePicture = ref("");
const uploadingImage = ref(false);
const avatarHover = ref(false);

const avatarInitials = computed(() => {
  const name = userName.value || "User";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const handleImageUpload = (file: File) => {
  // Implement your logic to convert file to base64 or upload to server
  // For now, just log
  console.log("Image uploaded:", file);
};

const handleImageRemove = () => {
  newProfilePicture.value = "";
};

const saveProfilePicture = async () => {
  if (!newProfilePicture.value || !user.value) return;

  uploadingImage.value = true;
  try {
    await authService.updateProfile({
      profilePicture: newProfilePicture.value,
      _id: user.value._id,
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

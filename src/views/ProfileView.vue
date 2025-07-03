<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <main
      class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 flex flex-col items-start gap-2 w-full max-w-md"
    >
      <pic-user />
      <status-user />
      <editable-input
        :value="userName"
        label=""
        placeholder="Seu nome"
        edit-title="Editar nome"
        @save="(val: string) => saveUserInfo({ key: 'fullName', value: val })"
      />
      <editable-input
        :value="userAbout"
        label="Descrição"
        placeholder="Sobre mim..."
        edit-title="Editar descrição"
        @save="(val: string) => saveUserInfo({ key: 'about', value: val })"
      />
      <div>
        <p class="text-white/70 text-xs mb-2">Email</p>
        <p class="text-white">{{ userEmail }}</p>
      </div>

      <divider-custom thickness="thin" />

      <div class="flex flex-col gap-4 w-full">
        <button
          class="flex items-center w-full py-2 px-4 border rounded bg-white/5 cursor-pointer transition text-sm font-medium border-red-400/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50"
          @click="handleLogout"
        >
          Sair da Conta
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import DividerCustom from "@/components/ui/DividerCustom.vue";
import EditableInput from "@/components/ui/EditableInput.vue";
import StatusUser from "@/components/ui/StatusUser.vue";
import PicUser from "@/components/ui/PicUser.vue";

const { logout, requireAuth } = useAuth();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const userName = computed(() => authStore.userName);
const userAbout = computed(() => authStore.userAbout);
const userEmail = computed(() => authStore.userEmail);

const editedUserName = ref(userName.value);
const editabledAbout = ref(userAbout.value);

watch(userName, (newVal) => {
  editedUserName.value = newVal;
});

watch(userAbout, (newVal) => {
  editabledAbout.value = newVal;
});

const nameEditing = ref(false);
const aboutEditing = ref(false);

const saveUserInfo = async (param: { key: string; value: any }) => {
  if (!param.value || !user.value) return;
  try {
    await authStore.updateUser({
      [param.key]: param.value,
      _id: user.value._id,
    });
    if (param.key === "fullName") nameEditing.value = false;
    if (param.key === "about") aboutEditing.value = false;
  } catch (error) {
    alert("Erro ao atualizar informação");
  }
};

onMounted(() => {
  requireAuth();
});

const handleLogout = async () => {
  if (confirm("Tem certeza que deseja sair da sua conta?")) {
    await logout();
  }
};
</script>

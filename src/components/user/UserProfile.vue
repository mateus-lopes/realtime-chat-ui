<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <main class="flex items-start gap-6 w-8/12">
      <section class="w-1/4">
        <div class="flex flex-col w-full">
          <!-- Menu Items -->
          <div class="space-y-2">
            <button
              @click="activeTab = 'user'"
              :class="[
                'w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 text-left',
                activeTab === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-zinc-800 hover:text-white',
              ]"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  activeTab === 'user' ? 'bg-white/20' : 'bg-blue-600',
                ]"
              >
                <svg
                  class="w-4 h-4"
                  :class="activeTab === 'user' ? 'text-white' : 'text-white'"
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
                <div class="font-medium">Editar perfil</div>
                <div class="text-xs opacity-70">
                  Alterar nome, foto e descrição
                </div>
              </div>
            </button>

            <button
              @click="activeTab = 'settings'"
              :class="[
                'w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 text-left',
                activeTab === 'settings'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:bg-zinc-800 hover:text-white',
              ]"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  activeTab === 'settings' ? 'bg-white/20' : 'bg-gray-600',
                ]"
              >
                <svg
                  class="w-4 h-4"
                  :class="
                    activeTab === 'settings' ? 'text-white' : 'text-white'
                  "
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
                <div class="font-medium">Configurações</div>
                <div class="text-xs opacity-70">Preferências e privacidade</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section class="w-3/4 flex flex-col flex-grow gap-2 items-start">
        <div v-if="activeTab === 'user'" class="w-full space-y-4">
          <div class="flex items-center gap-6">
            <pic-user />
            <status-user />
          </div>
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
        </div>

        <div v-else-if="activeTab === 'settings'" class="w-full">
          <div
            class="flex flex-col items-center justify-center h-96 text-center"
          >
            <div
              class="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <svg
                class="w-10 h-10 text-gray-300"
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
            <h3 class="text-white text-2xl font-semibold mb-3">
              Em Desenvolvimento
            </h3>
            <p class="text-gray-400 text-base max-w-md leading-relaxed mb-6">
              As configurações avançadas estão sendo desenvolvidas. Em breve
              você poderá personalizar suas preferências e configurações de
              privacidade.
            </p>
            <div
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-lg"
            >
              <span class="text-2xl">🚧</span>
              <span class="text-blue-400 text-sm font-medium"
                >Funcionalidade em construção</span
              >
            </div>

            <!-- Lista de futuras funcionalidades -->
            <div class="mt-8">
              <h4 class="text-gray-300 text-sm font-medium mb-4 text-center">
                Próximas funcionalidades:
              </h4>
              <div class="space-y-2 text-center">
                <div class="flex items-center gap-3 text-gray-400 text-sm">
                  <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span>Notificações personalizadas</span>
                </div>
                <div class="flex items-center gap-3 text-gray-400 text-sm">
                  <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span>Tema e aparência</span>
                </div>
                <div class="flex items-center gap-3 text-gray-400 text-sm">
                  <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span>Configurações de privacidade</span>
                </div>
                <div class="flex items-center gap-3 text-gray-400 text-sm">
                  <div class="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span>Backup e sincronização</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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

const activeTab = ref<"user" | "settings">("user");

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

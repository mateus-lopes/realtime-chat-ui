<template>
  <form
    class="flex items-end gap-2 px-6 py-4 border-t border-zinc-950 bg-black"
    @submit.prevent="send"
  >
    <button
      type="button"
      @click="toggleEmojiPicker"
      class="text-white rounded-lg p-2 font-medium hover:bg-zinc-950 transition flex-shrink-0 mb-1"
    >
      <span class="material-symbols-outlined text-neutral-500"
        >emoji_emotions</span
      >
    </button>

    <button
      type="button"
      @click="openAttachments"
      class="text-white rounded-lg p-2 font-medium hover:bg-zinc-950 transition flex-shrink-0 mb-1"
    >
      <span class="material-symbols-outlined text-neutral-500"
        >attach_file</span
      >
    </button>

    <div class="flex-1 relative">
      <textarea
        ref="textareaRef"
        v-model="input"
        @keydown="handleKeydown"
        @input="adjustHeight"
        placeholder="Digite uma mensagem"
        class="w-full bg-transparent text-white/90 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all duration-200"
        rows="1"
        autocomplete="off"
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="!input.trim()"
      class="rounded-lg p-2 font-medium transition flex-shrink-0 mb-1"
      :class="
        input.trim()
          ? 'text-white bg-green-600 hover:bg-green-700'
          : 'text-neutral-500 hover:bg-zinc-950'
      "
    >
      <span class="material-symbols-outlined">send</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";

const input = ref("");
const textareaRef = ref<HTMLTextAreaElement>();
const textareaHeight = ref(48); // altura inicial em pixels

// Configurações de altura
const MIN_HEIGHT = 48;
const MAX_HEIGHT = 120; // máximo de ~5 linhas

const emit = defineEmits<{
  send: [message: string];
  emojiPicker: [];
  attachments: [];
}>();

const send = () => {
  if (input.value.trim()) {
    emit("send", input.value);
    input.value = "";
    resetHeight();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      // Shift+Enter: nova linha
      return;
    } else {
      // Enter: enviar mensagem
      event.preventDefault();
      send();
    }
  }
};

const adjustHeight = async () => {
  if (!textareaRef.value) return;

  await nextTick();

  // Temporariamente define altura como auto para calcular o scrollHeight correto
  textareaRef.value.style.height = "auto";

  const scrollHeight = textareaRef.value.scrollHeight;
  const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);

  textareaHeight.value = newHeight;
  textareaRef.value.style.height = newHeight + "px";

  // Se atingiu altura máxima, mostra scroll
  if (scrollHeight > MAX_HEIGHT) {
    textareaRef.value.style.overflowY = "auto";
  } else {
    textareaRef.value.style.overflowY = "hidden";
  }
};

const resetHeight = () => {
  textareaHeight.value = MIN_HEIGHT;
  if (textareaRef.value) {
    textareaRef.value.style.height = MIN_HEIGHT + "px";
    textareaRef.value.style.overflowY = "hidden";
  }
};

const toggleEmojiPicker = () => {
  emit("emojiPicker");
};

const openAttachments = () => {
  emit("attachments");
};

onMounted(() => {
  adjustHeight();
});
</script>

<style scoped>
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: black;
  padding: 5px 2px !important;
  margin: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #3f3f46;
  border-radius: 2px;
}
</style>

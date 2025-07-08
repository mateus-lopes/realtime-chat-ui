<template>
  <form
    class="flex items-end gap-2 p-2 px-6 py-4 border-t border-zinc-700 bg-black"
    @submit.prevent="send"
  >
    <button
      type="button"
      @click="toggleEmojiPicker"
      class="text-white rounded-lg px-2 pt-2 pb-1 font-medium hover:bg-zinc-900 transition flex-shrink-0 mb-1"
    >
      <span class="material-symbols-outlined pt-1 text-neutral-500"
        >emoji_emotions</span
      >
    </button>

    <button
      type="button"
      @click="openAttachments"
      class="text-white rounded-lg px-2 pt-2 pb-1 font-medium hover:bg-zinc-900 transition flex-shrink-0 mb-1"
    >
      <span class="material-symbols-outlined pt-1 text-neutral-500"
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
        class="w-full bg-transparent text-white/90 px-4 pt-4 focus:outline-none resize-none"
        rows="1"
        autocomplete="off"
      ></textarea>
    </div>

    <button
      type="submit"
      :disabled="!input.trim()"
      class="rounded-lg p-2 font-medium transition flex-shrink-0"
      :class="
        input.trim()
          ? 'text-white bg-green-600 hover:bg-green-700'
          : 'text-neutral-500 hover:bg-zinc-900'
      "
    >
      <span class="material-symbols-outlined pt-1">send</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";

const input = ref("");
const textareaRef = ref<HTMLTextAreaElement>();
const textareaHeight = ref(48);

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 120;

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
      return;
    } else {
      event.preventDefault();
      send();
    }
  }
};

const adjustHeight = async () => {
  if (!textareaRef.value) return;

  await nextTick();

  textareaRef.value.style.height = "auto";

  const scrollHeight = textareaRef.value.scrollHeight;
  const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);

  textareaHeight.value = newHeight;
  textareaRef.value.style.height = newHeight + "px";

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

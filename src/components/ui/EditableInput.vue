<template>
  <div class="w-full">
    <template v-if="editing">
      <div class="flex items-center gap-2">
        <input
          v-model="editedValue"
          :placeholder="placeholder"
          class="block w-4/5 p-2 border border-white/20 rounded-lg bg-white/5 text-white focus:outline-none focus:border-blue-500 placeholder-white/50"
          type="text"
          @blur="handleBlur"
          ref="inputRef"
        />
        <MobileButton
          variant="primary"
          size="sm"
          @mousedown="saving = true"
          @mouseup="saving = false"
          @mouseleave="saving = false"
          @click="onSave"
        >
          Salvar
        </MobileButton>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <p v-if="label" class="text-white/70 text-xs mb-2">{{ label }}</p>
          <p class="text-white">{{ value || placeholder }}</p>
        </div>
        <button
          class="bg-transparent border-none text-white p-1 rounded-full transition hover:bg-white/5"
          @click="startEdit"
          :title="editTitle"
        >
          <span class="material-symbols-outlined text-lg mt-2">edit</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import MobileButton from "@/components/ui/MobileButton.vue";
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Digite aqui...",
  },
  editTitle: {
    type: String,
    default: "Editar",
  },
});

const emits = defineEmits(["save", "cancel"]);

const editing = ref(false);
const editedValue = ref(props.value);
const inputRef = ref(null);
const saving = ref(false);

watch(
  () => props.value,
  (val) => {
    if (!editing.value) editedValue.value = val;
  }
);

function startEdit() {
  editedValue.value = props.value;
  editing.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

function onSave() {
  emits("save", editedValue.value);
  editing.value = false;
}

function handleBlur() {
  // Só cancela se não estiver salvando
  setTimeout(() => {
    if (!saving.value) {
      emits("cancel");
      editing.value = false;
    }
  }, 10);
}
</script>

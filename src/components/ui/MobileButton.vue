<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition-colors duration-150',
      sizeClass,
      variantClass,
      disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <span
      v-if="loading"
      class="mr-2 w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"
    ></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary", // 'primary' | 'outlined' | 'tonal'
  },
  size: {
    type: String,
    default: "md", // 'sm' | 'md' | 'lg'
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-sm min-h-[36px]";
    case "lg":
      return "px-6 py-3 text-lg min-h-[48px]";
    default:
      return "px-4 py-2 text-base min-h-[40px]";
  }
});

const variantClass = computed(() => {
  switch (props.variant) {
    case "outlined":
      return "bg-transparent text-primary-500 border border-primary-500 hover:text-white/50 hover:border-white/50";
    case "tonal":
      return "bg-primary-900/60 text-primary-400 hover:bg-primary-900/80";
    default:
      return "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800";
  }
});
</script>

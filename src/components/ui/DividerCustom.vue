<template>
  <div
    :class="[
      'w-full',
      `border-t`,
      colorClass,
      thicknessClass,
      marginClass,
      customClass,
    ]"
    :style="customStyle"
  ></div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "white/10", // tailwind color
  },
  thickness: {
    type: String,
    default: "border", // tailwind border size: border, border-2, border-4, etc.
  },
  margin: {
    type: String,
    default: "my-4", // tailwind margin
  },
  customClass: {
    type: String,
    default: "",
  },
  customStyle: {
    type: [String, Object],
    default: "",
  },
});

const colorClass = computed(() => `border-${props.color}`);
const thicknessClass = computed(() => props.thickness);
const marginClass = computed(() => props.margin);
</script>

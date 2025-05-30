<template>
  <div 
    :class="spinnerClasses"
    :style="spinnerStyle"
    role="status"
    :aria-label="ariaLabel"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="31.416"
        stroke-dashoffset="31.416"
        class="spinner-circle"
      />
    </svg>
    <span class="sr-only">{{ ariaLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: number;
  color?: string;
  variant?: 'default' | 'dots' | 'pulse';
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  variant: 'default',
  ariaLabel: 'Loading...'
});

const spinnerClasses = computed(() => [
  'loading-spinner',
  `loading-spinner--${props.variant}`
]);

const spinnerStyle = computed(() => ({
  color: props.color
}));
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner--default .spinner-circle {
  animation: spin 1s linear infinite;
  transform-origin: center;
}

.loading-spinner--dots {
  display: flex;
  gap: 2px;
}

.loading-spinner--dots::before,
.loading-spinner--dots::after,
.loading-spinner--dots {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  animation: dots 1.4s ease-in-out infinite both;
}

.loading-spinner--dots::before {
  animation-delay: -0.32s;
}

.loading-spinner--dots::after {
  animation-delay: -0.16s;
}

.loading-spinner--pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% {
    stroke-dashoffset: 31.416;
    transform: rotate(0deg);
  }
  50% {
    stroke-dashoffset: 15.708;
    transform: rotate(180deg);
  }
  100% {
    stroke-dashoffset: 31.416;
    transform: rotate(360deg);
  }
}

@keyframes dots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
}
</style>

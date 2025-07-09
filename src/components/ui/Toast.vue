<template>
  <div class="toast" :class="toastClasses">
    <div class="toast-icon">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" :d="iconPath" />
      </svg>
    </div>
    <div class="toast-content">
      <h4 class="toast-title">{{ toast.title }}</h4>
      <p v-if="toast.message" class="toast-message">{{ toast.message }}</p>
    </div>
    <button
      class="toast-close"
      @click="$emit('close')"
      aria-label="Fechar notificação"
    >
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path
          fill="currentColor"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Toast } from "@/composables/useToast";

interface Props {
  toast: Toast;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const toastClasses = computed(() => [`toast--${props.toast.type}`]);

const iconPath = computed(() => {
  const paths = {
    success:
      "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",
    error:
      "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A1,1 0 0,0 11,8V12A1,1 0 0,0 12,13A1,1 0 0,0 13,12V8A1,1 0 0,0 12,7M12,17.5A1.5,1.5 0 0,1 10.5,16A1.5,1.5 0 0,1 12,14.5A1.5,1.5 0 0,1 13.5,16A1.5,1.5 0 0,1 12,17.5Z",
    warning: "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",
    info: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  };

  return paths[props.toast.type];
});
</script>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 400px;
  min-width: 300px;
  position: relative;
}

.toast--success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.toast--error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.toast--warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.toast--info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  color: white;
}

.toast-message {
  font-size: 0.8rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  margin-top: -0.125rem;
  margin-right: -0.25rem;
}

.toast-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .toast {
    min-width: 280px;
    max-width: 320px;
  }
}
</style>

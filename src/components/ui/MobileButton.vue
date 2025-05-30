<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <span v-if="loading" class="loading-spinner">
      <LoadingSpinner :size="16" />
    </span>
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isPressed = ref(false);

const buttonClasses = computed(() => [
  'mobile-button',
  `mobile-button--${props.variant}`,
  `mobile-button--${props.size}`,
  {
    'mobile-button--disabled': props.disabled || props.loading,
    'mobile-button--loading': props.loading,
    'mobile-button--full-width': props.fullWidth,
    'mobile-button--pressed': isPressed.value
  }
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const handleTouchStart = () => {
  if (!props.disabled && !props.loading) {
    isPressed.value = true;
  }
};

const handleTouchEnd = () => {
  isPressed.value = false;
};
</script>

<style scoped>
.mobile-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  
  /* Ensure minimum touch target size */
  min-height: 44px;
  min-width: 44px;
}

/* Size variants */
.mobile-button--sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.mobile-button--md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 44px;
}

.mobile-button--lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 52px;
}

/* Color variants */
.mobile-button--primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.mobile-button--primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.mobile-button--primary:active,
.mobile-button--primary.mobile-button--pressed {
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.3);
}

.mobile-button--secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-button--secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.mobile-button--secondary:active,
.mobile-button--secondary.mobile-button--pressed {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(1px);
}

.mobile-button--outline {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.mobile-button--outline:hover {
  background: rgba(59, 130, 246, 0.1);
}

.mobile-button--outline:active,
.mobile-button--outline.mobile-button--pressed {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(1px);
}

.mobile-button--ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
}

.mobile-button--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.mobile-button--ghost:active,
.mobile-button--ghost.mobile-button--pressed {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(1px);
}

.mobile-button--danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.mobile-button--danger:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.mobile-button--danger:active,
.mobile-button--danger.mobile-button--pressed {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.3);
}

/* States */
.mobile-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.mobile-button--loading {
  cursor: wait;
}

.mobile-button--full-width {
  width: 100%;
}

.loading-spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Focus styles for accessibility */
.mobile-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .mobile-button {
    min-height: 40px;
  }
  
  .mobile-button--sm {
    min-height: 32px;
  }
  
  .mobile-button--md {
    min-height: 40px;
  }
  
  .mobile-button--lg {
    min-height: 48px;
  }
}
</style>

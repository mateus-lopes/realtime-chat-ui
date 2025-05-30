<template>
  <div class="mobile-input-wrapper">
    <label 
      v-if="label" 
      :for="inputId"
      class="mobile-input-label"
      :class="{ 'mobile-input-label--error': hasError }"
    >
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>
    
    <div class="mobile-input-container">
      <div 
        v-if="$slots.prefix || prefixIcon"
        class="mobile-input-prefix"
      >
        <slot name="prefix">
          <i v-if="prefixIcon" :class="prefixIcon" />
        </slot>
      </div>
      
      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :pattern="pattern"
        :maxlength="maxlength"
        :minlength="minlength"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      
      <div 
        v-if="$slots.suffix || suffixIcon || (type === 'password')"
        class="mobile-input-suffix"
      >
        <slot name="suffix">
          <button
            v-if="type === 'password'"
            type="button"
            class="password-toggle"
            @click="togglePasswordVisibility"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <i :class="showPassword ? 'icon-eye-off' : 'icon-eye'" />
          </button>
          <i v-else-if="suffixIcon" :class="suffixIcon" />
        </slot>
      </div>
    </div>
    
    <div 
      v-if="hasError || hint"
      class="mobile-input-message"
      :class="{ 'mobile-input-message--error': hasError }"
    >
      {{ hasError ? error : hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';

interface Props {
  modelValue: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autocomplete?: string;
  inputmode?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search';
  pattern?: string;
  maxlength?: number;
  minlength?: number;
  prefixIcon?: string;
  suffixIcon?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
}>();

const inputRef = ref<HTMLInputElement>();
const showPassword = ref(false);
const isFocused = ref(false);

const inputId = computed(() => `mobile-input-${Math.random().toString(36).substr(2, 9)}`);

const hasError = computed(() => !!props.error);

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const inputClasses = computed(() => [
  'mobile-input',
  `mobile-input--${props.size}`,
  `mobile-input--${props.variant}`,
  {
    'mobile-input--error': hasError.value,
    'mobile-input--disabled': props.disabled,
    'mobile-input--readonly': props.readonly,
    'mobile-input--focused': isFocused.value,
    'mobile-input--has-prefix': props.prefixIcon || !!props.$slots?.prefix,
    'mobile-input--has-suffix': props.suffixIcon || !!props.$slots?.suffix || props.type === 'password'
  }
]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  // Keep focus on input after toggling
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const focus = () => {
  inputRef.value?.focus();
};

const blur = () => {
  inputRef.value?.blur();
};

defineExpose({
  focus,
  blur,
  inputRef
});
</script>

<style scoped>
.mobile-input-wrapper {
  width: 100%;
}

.mobile-input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s ease;
}

.mobile-input-label--error {
  color: #ef4444;
}

.required-asterisk {
  color: #ef4444;
  margin-left: 0.25rem;
}

.mobile-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.mobile-input {
  width: 100%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

/* Size variants */
.mobile-input--sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-height: 36px;
}

.mobile-input--md {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  min-height: 44px;
}

.mobile-input--lg {
  padding: 1rem 1.25rem;
  font-size: 1.125rem;
  min-height: 52px;
}

/* Variant styles */
.mobile-input--filled {
  background: rgba(255, 255, 255, 0.1);
  border-color: transparent;
}

.mobile-input--outline {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
}

/* States */
.mobile-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.mobile-input--error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.mobile-input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.mobile-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.02);
}

.mobile-input--readonly {
  background: rgba(255, 255, 255, 0.02);
  cursor: default;
}

/* Prefix and suffix */
.mobile-input--has-prefix {
  padding-left: 2.5rem;
}

.mobile-input--has-suffix {
  padding-right: 2.5rem;
}

.mobile-input-prefix,
.mobile-input-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 1;
}

.mobile-input-prefix {
  left: 0.75rem;
}

.mobile-input-suffix {
  right: 0.75rem;
}

.password-toggle {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease;
  pointer-events: auto;
  min-height: 24px;
  min-width: 24px;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
}

.password-toggle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.mobile-input-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.mobile-input-message--error {
  color: #ef4444;
}

/* Placeholder styles */
.mobile-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* iOS specific fixes */
.mobile-input::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.mobile-input::-moz-placeholder {
  color: rgba(255, 255, 255, 0.4);
  opacity: 1;
}

/* Remove autofill background */
.mobile-input:-webkit-autofill,
.mobile-input:-webkit-autofill:hover,
.mobile-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.05) inset;
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

/* Icon placeholders - replace with your icon system */
.icon-eye::before {
  content: '👁';
}

.icon-eye-off::before {
  content: '🙈';
}
</style>

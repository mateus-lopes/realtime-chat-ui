// Form Composable for Mobile-First Chat App

import { ref, reactive, computed } from 'vue';
import type { FormState, FormField, ValidationRule } from '@/types/auth.types';

export function useForm<T extends Record<string, any>>(initialValues: T, validationRules: Record<keyof T, ValidationRule[]>) {
  // Create reactive form state
  const formState = reactive<FormState>({});
  
  // Initialize form fields
  Object.keys(initialValues).forEach(key => {
    formState[key] = {
      value: initialValues[key],
      error: null,
      touched: false,
      rules: validationRules[key] || []
    };
  });

  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  // Computed properties
  const isValid = computed(() => {
    return Object.values(formState).every(field => !field.error);
  });

  const hasErrors = computed(() => {
    return Object.values(formState).some(field => field.error);
  });

  const touchedFields = computed(() => {
    return Object.values(formState).filter(field => field.touched);
  });

  const isDirty = computed(() => {
    return Object.keys(formState).some(key => {
      return formState[key].value !== initialValues[key];
    });
  });

  // Validation functions
  const validateField = (fieldName: string): boolean => {
    const field = formState[fieldName];
    if (!field) return true;

    field.error = null;

    for (const rule of field.rules) {
      if (rule.required && (!field.value || field.value.trim() === '')) {
        field.error = rule.message;
        return false;
      }

      if (rule.minLength && field.value.length < rule.minLength) {
        field.error = rule.message;
        return false;
      }

      if (rule.maxLength && field.value.length > rule.maxLength) {
        field.error = rule.message;
        return false;
      }

      if (rule.pattern && !rule.pattern.test(field.value)) {
        field.error = rule.message;
        return false;
      }

      if (rule.custom && !rule.custom(field.value)) {
        field.error = rule.message;
        return false;
      }
    }

    return true;
  };

  const validateForm = (): boolean => {
    let isFormValid = true;
    
    Object.keys(formState).forEach(fieldName => {
      const fieldValid = validateField(fieldName);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  // Field manipulation
  const setValue = (fieldName: string, value: any) => {
    if (formState[fieldName]) {
      formState[fieldName].value = value;
      // Validate on change if field was already touched
      if (formState[fieldName].touched) {
        validateField(fieldName);
      }
    }
  };

  const setTouched = (fieldName: string, touched: boolean = true) => {
    if (formState[fieldName]) {
      formState[fieldName].touched = touched;
      if (touched) {
        validateField(fieldName);
      }
    }
  };

  const setError = (fieldName: string, error: string | null) => {
    if (formState[fieldName]) {
      formState[fieldName].error = error;
    }
  };

  const clearErrors = () => {
    Object.keys(formState).forEach(fieldName => {
      formState[fieldName].error = null;
    });
    submitError.value = null;
  };

  const resetForm = () => {
    Object.keys(formState).forEach(fieldName => {
      formState[fieldName].value = initialValues[fieldName];
      formState[fieldName].error = null;
      formState[fieldName].touched = false;
    });
    isSubmitting.value = false;
    submitError.value = null;
  };

  // Get form values
  const getValues = (): T => {
    const values = {} as T;
    Object.keys(formState).forEach(key => {
      values[key as keyof T] = formState[key].value;
    });
    return values;
  };

  // Handle form submission
  const handleSubmit = async (onSubmit: (values: T) => Promise<void> | void) => {
    // Mark all fields as touched
    Object.keys(formState).forEach(fieldName => {
      setTouched(fieldName, true);
    });

    if (!validateForm()) {
      return;
    }

    try {
      isSubmitting.value = true;
      submitError.value = null;
      await onSubmit(getValues());
    } catch (error: any) {
      submitError.value = error.message || 'An error occurred';
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  // Mobile-specific: Handle input events
  const handleInput = (fieldName: string) => (event: Event) => {
    const target = event.target as HTMLInputElement;
    setValue(fieldName, target.value);
  };

  const handleBlur = (fieldName: string) => () => {
    setTouched(fieldName, true);
  };

  const handleFocus = (fieldName: string) => () => {
    // Clear error on focus for better mobile UX
    if (formState[fieldName]?.error) {
      setError(fieldName, null);
    }
  };

  // Get field props for easy binding
  const getFieldProps = (fieldName: string) => {
    const field = formState[fieldName];
    if (!field) return {};

    return {
      value: field.value,
      error: field.error,
      touched: field.touched,
      onInput: handleInput(fieldName),
      onBlur: handleBlur(fieldName),
      onFocus: handleFocus(fieldName)
    };
  };

  return {
    // State
    formState,
    isSubmitting,
    submitError,

    // Computed
    isValid,
    hasErrors,
    touchedFields,
    isDirty,

    // Methods
    setValue,
    setTouched,
    setError,
    clearErrors,
    resetForm,
    validateField,
    validateForm,
    getValues,
    handleSubmit,
    getFieldProps,

    // Mobile helpers
    handleInput,
    handleBlur,
    handleFocus
  };
}

import { ref, reactive, computed } from "vue";
import type { FormState, ValidationRule } from "@/types/auth.types";

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T | string, ValidationRule[]>>
) {
  const formState = reactive<FormState>({});

  Object.keys(initialValues).forEach((key) => {
    formState[key] = {
      value: initialValues[key],
      error: null,
      touched: false,
      rules: validationRules[key] || [],
    };
  });

  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  const isValid = computed(() => {
    return Object.values(formState).every((field) => !field.error);
  });

  const hasErrors = computed(() => {
    return Object.values(formState).some((field) => field.error);
  });

  const isDirty = computed(() => {
    return Object.keys(formState).some((key) => {
      return formState[key].value !== initialValues[key];
    });
  });

  const validateField = (fieldName: string): boolean => {
    const field = formState[fieldName];
    if (!field) return true;

    field.error = null;

    for (const rule of field.rules) {
      if (!validateRule(field.value, rule)) {
        field.error = rule.message;
        return false;
      }
    }

    return true;
  };

  const validateRule = (value: string, rule: ValidationRule): boolean => {
    switch (rule.type) {
      case "required":
        return value.trim() !== "";

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);

      case "minLength":
        return value.length >= (rule.value as number);

      case "maxLength":
        return value.length <= (rule.value as number);

      case "pattern":
        return (rule.value as RegExp).test(value);

      default:
        return true;
    }
  };

  const validateForm = (): boolean => {
    let isFormValid = true;

    Object.keys(formState).forEach((fieldName) => {
      const fieldValid = validateField(fieldName);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  const setValue = (fieldName: string, value: string) => {
    if (formState[fieldName]) {
      formState[fieldName].value = value;

      if (formState[fieldName].touched) {
        validateField(fieldName);
      }
    }
  };

  const setTouched = (fieldName: string, touched: boolean) => {
    if (formState[fieldName]) {
      formState[fieldName].touched = touched;

      if (touched) {
        validateField(fieldName);
      }
    }
  };

  const getValues = (): T => {
    const values = {} as T;
    (Object.keys(initialValues) as (keyof T)[]).forEach((key) => {
      values[key] = formState[key as string].value as any;
    });
    return values;
  };

  const handleSubmit = async (onSubmit: (values: T) => Promise<void>) => {
    try {
      isSubmitting.value = true;
      submitError.value = null;

      Object.keys(formState).forEach((fieldName) => {
        setTouched(fieldName, true);
      });

      if (!validateForm()) {
        return;
      }

      await onSubmit(getValues());
    } catch (error: any) {
      submitError.value = error.message || "Submission failed";
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  const resetForm = () => {
    Object.keys(formState).forEach((key) => {
      formState[key].value = initialValues[key];
      formState[key].error = null;
      formState[key].touched = false;
    });
    submitError.value = null;
  };

  const handleInput = (fieldName: string) => (event: Event) => {
    const target = event.target as HTMLInputElement;
    setValue(fieldName, target.value);
  };

  const handleBlur = (fieldName: string) => () => {
    setTouched(fieldName, true);
  };

  return {
    formState,
    isSubmitting,
    submitError,
    isValid,
    hasErrors,
    isDirty,
    validateField,
    validateForm,
    setValue,
    setTouched,
    getValues,
    handleSubmit,
    resetForm,
    handleInput,
    handleBlur,
  };
}

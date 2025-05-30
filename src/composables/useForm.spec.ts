import { useForm } from './useForm';
import type { ValidationRule } from '@/types/auth.types';

describe('useForm', () => {
  const initialValues = {
    email: '',
    password: '',
    name: ''
  };

  const validationRules: Record<string, ValidationRule[]> = {
    email: [
      { required: true, message: 'Email is required' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { minLength: 6, message: 'Password must be at least 6 characters' }
    ],
    name: [
      { required: true, message: 'Name is required' },
      { minLength: 2, message: 'Name must be at least 2 characters' },
      { maxLength: 50, message: 'Name must be less than 50 characters' }
    ]
  };

  it('initializes form state correctly', () => {
    const { formState, isValid, hasErrors, isDirty } = useForm(initialValues, validationRules);

    expect(formState.email.value).toBe('');
    expect(formState.email.error).toBeNull();
    expect(formState.email.touched).toBe(false);
    expect(formState.email.rules).toEqual(validationRules.email);

    expect(isValid.value).toBe(true); // No validation errors initially
    expect(hasErrors.value).toBe(false);
    expect(isDirty.value).toBe(false);
  });

  it('validates required fields', () => {
    const { formState, validateField } = useForm(initialValues, validationRules);

    const isValid = validateField('email');

    expect(isValid).toBe(false);
    expect(formState.email.error).toBe('Email is required');
  });

  it('validates email pattern', () => {
    const { formState, setValue, validateField } = useForm(initialValues, validationRules);

    setValue('email', 'invalid-email');
    const isValid = validateField('email');

    expect(isValid).toBe(false);
    expect(formState.email.error).toBe('Invalid email');
  });

  it('validates minimum length', () => {
    const { formState, setValue, validateField } = useForm(initialValues, validationRules);

    setValue('password', '123');
    const isValid = validateField('password');

    expect(isValid).toBe(false);
    expect(formState.password.error).toBe('Password must be at least 6 characters');
  });

  it('validates maximum length', () => {
    const { formState, setValue, validateField } = useForm(initialValues, validationRules);

    setValue('name', 'a'.repeat(51));
    const isValid = validateField('name');

    expect(isValid).toBe(false);
    expect(formState.name.error).toBe('Name must be less than 50 characters');
  });

  it('passes validation with valid values', () => {
    const { formState, setValue, validateField } = useForm(initialValues, validationRules);

    setValue('email', 'test@example.com');
    setValue('password', 'password123');
    setValue('name', 'John Doe');

    expect(validateField('email')).toBe(true);
    expect(validateField('password')).toBe(true);
    expect(validateField('name')).toBe(true);

    expect(formState.email.error).toBeNull();
    expect(formState.password.error).toBeNull();
    expect(formState.name.error).toBeNull();
  });

  it('validates entire form', () => {
    const { setValue, validateForm } = useForm(initialValues, validationRules);

    // Invalid form
    expect(validateForm()).toBe(false);

    // Valid form
    setValue('email', 'test@example.com');
    setValue('password', 'password123');
    setValue('name', 'John Doe');

    expect(validateForm()).toBe(true);
  });

  it('tracks touched state', () => {
    const { formState, setTouched } = useForm(initialValues, validationRules);

    expect(formState.email.touched).toBe(false);

    setTouched('email', true);

    expect(formState.email.touched).toBe(true);
  });

  it('tracks dirty state', () => {
    const { isDirty, setValue } = useForm(initialValues, validationRules);

    expect(isDirty.value).toBe(false);

    setValue('email', 'test@example.com');

    expect(isDirty.value).toBe(true);
  });

  it('computes form validity', () => {
    const { isValid, setValue } = useForm(initialValues, validationRules);

    // Initially valid (no validation run yet)
    expect(isValid.value).toBe(true);

    // Set valid values
    setValue('email', 'test@example.com');
    setValue('password', 'password123');
    setValue('name', 'John Doe');

    expect(isValid.value).toBe(true);
  });

  it('gets form values', () => {
    const { setValue, getValues } = useForm(initialValues, validationRules);

    setValue('email', 'test@example.com');
    setValue('password', 'password123');
    setValue('name', 'John Doe');

    const values = getValues();

    expect(values).toEqual({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe'
    });
  });

  it('resets form', () => {
    const { formState, setValue, setTouched, setError, resetForm } = useForm(initialValues, validationRules);

    // Modify form state
    setValue('email', 'test@example.com');
    setTouched('email', true);
    setError('email', 'Some error');

    resetForm();

    expect(formState.email.value).toBe('');
    expect(formState.email.touched).toBe(false);
    expect(formState.email.error).toBeNull();
  });

  it('clears errors', () => {
    const { formState, setError, clearErrors } = useForm(initialValues, validationRules);

    setError('email', 'Some error');
    setError('password', 'Another error');

    expect(formState.email.error).toBe('Some error');
    expect(formState.password.error).toBe('Another error');

    clearErrors();

    expect(formState.email.error).toBeNull();
    expect(formState.password.error).toBeNull();
  });

  it('handles form submission', async () => {
    const { setValue, handleSubmit, isSubmitting } = useForm(initialValues, validationRules);
    const mockSubmit = jest.fn().mockResolvedValue(undefined);

    setValue('email', 'test@example.com');
    setValue('password', 'password123');
    setValue('name', 'John Doe');

    expect(isSubmitting.value).toBe(false);

    const submitPromise = handleSubmit(mockSubmit);

    expect(isSubmitting.value).toBe(true);

    await submitPromise;

    expect(isSubmitting.value).toBe(false);
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe'
    });
  });

  it('handles form submission error', async () => {
    const { setValue, handleSubmit, submitError } = useForm(initialValues, validationRules);
    const errorMessage = 'Submission failed';
    const mockSubmit = jest.fn().mockRejectedValue(new Error(errorMessage));

    setValue('email', 'test@example.com');
    setValue('password', 'password123');
    setValue('name', 'John Doe');

    await expect(handleSubmit(mockSubmit)).rejects.toThrow(errorMessage);

    expect(submitError.value).toBe(errorMessage);
  });

  it('prevents submission with invalid form', async () => {
    const { handleSubmit } = useForm(initialValues, validationRules);
    const mockSubmit = jest.fn();

    // Don't set any values (form will be invalid)
    await handleSubmit(mockSubmit);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates on change when field is touched', () => {
    const { formState, setValue, setTouched } = useForm(initialValues, validationRules);

    setTouched('email', true);
    setValue('email', 'invalid-email');

    expect(formState.email.error).toBe('Invalid email');
  });

  it('does not validate on change when field is not touched', () => {
    const { formState, setValue } = useForm(initialValues, validationRules);

    setValue('email', 'invalid-email');

    expect(formState.email.error).toBeNull();
  });

  it('provides field props for easy binding', () => {
    const { getFieldProps, setValue } = useForm(initialValues, validationRules);

    const emailProps = getFieldProps('email');

    expect(emailProps.value).toBe('');
    expect(emailProps.error).toBeNull();
    expect(emailProps.touched).toBe(false);
    expect(typeof emailProps.onInput).toBe('function');
    expect(typeof emailProps.onBlur).toBe('function');
    expect(typeof emailProps.onFocus).toBe('function');
  });

  it('handles custom validation rules', () => {
    const customRules: Record<string, ValidationRule[]> = {
      password: [
        { 
          custom: (value: string) => /[A-Z]/.test(value), 
          message: 'Password must contain uppercase letter' 
        }
      ]
    };

    const { setValue, validateField } = useForm({ password: '' }, customRules);

    setValue('password', 'lowercase');
    expect(validateField('password')).toBe(false);

    setValue('password', 'Uppercase');
    expect(validateField('password')).toBe(true);
  });
});

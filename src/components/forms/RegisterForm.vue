<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <div class="form-fields">
      <MobileInput
        v-model="formState.fullName.value"
        type="text"
        label="Nome completo"
        placeholder="Seu nome"
        autocomplete="name"
        :error="formState.fullName.error"
        :disabled="isSubmitting"
        required
        @blur="setTouched('fullName', true)"
      />

      <MobileInput
        v-model="formState.email.value"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        autocomplete="email"
        inputmode="email"
        :error="formState.email.error"
        :disabled="isSubmitting"
        required
        @blur="setTouched('email', true)"
      />

      <MobileInput
        v-model="formState.password.value"
        type="password"
        label="Senha"
        placeholder="Crie uma senha segura"
        autocomplete="new-password"
        :error="formState.password.error"
        :disabled="isSubmitting"
        required
        @blur="setTouched('password', true)"
      />

      <MobileInput
        v-if="formState.password.value"
        v-model="formState.confirmPassword.value"
        type="password"
        label="Confirmar senha"
        placeholder="Digite a senha novamente"
        autocomplete="new-password"
        :error="formState.confirmPassword.error"
        :disabled="isSubmitting"
        required
        @blur="setTouched('confirmPassword', true)"
      />

      <div class="password-requirements" v-if="formState.password.value">
        <p class="requirements-title">Sua senha deve ter:</p>
        <ul class="requirements-list">
          <li :class="{ 'requirement-met': hasMinLength }">
            <span class="requirement-icon">{{ hasMinLength ? "✓" : "○" }}</span>
            Pelo menos 8 caracteres
          </li>
          <li :class="{ 'requirement-met': hasUppercase }">
            <span class="requirement-icon">{{ hasUppercase ? "✓" : "○" }}</span>
            Uma letra maiúscula
          </li>
          <li :class="{ 'requirement-met': hasLowercase }">
            <span class="requirement-icon">{{ hasLowercase ? "✓" : "○" }}</span>
            Uma letra minúscula
          </li>
          <li :class="{ 'requirement-met': hasNumber }">
            <span class="requirement-icon">{{ hasNumber ? "✓" : "○" }}</span>
            Um número
          </li>
        </ul>
      </div>

      <label class="terms-wrapper">
        <input
          v-model="formState.acceptTerms.value"
          type="checkbox"
          class="checkbox"
          :disabled="isSubmitting"
          @blur="setTouched('acceptTerms', true)"
        />
        <span class="terms-text">
          Eu aceito os
          <a href="/terms" target="_blank" class="terms-link">Termos de Uso</a>
          e a
          <a href="/privacy" target="_blank" class="terms-link"
            >Política de Privacidade</a
          >
        </span>
      </label>
      <div v-if="formState.acceptTerms.error" class="field-error">
        {{ formState.acceptTerms.error }}
      </div>
    </div>

    <div class="form-actions">
      <MobileButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="isSubmitting"
        :disabled="!isValid || isSubmitting"
        full-width
      >
        Criar Conta
      </MobileButton>

      <div class="form-divider"></div>
    </div>

    <div class="form-footer">
      <p class="login-prompt">
        Já tem uma conta?
        <router-link
          to="/login"
          class="login-link"
          :class="{ 'pointer-events-none opacity-50': isSubmitting }"
        >
          Fazer login
        </router-link>
      </p>
    </div>

    <div v-if="submitError" class="error-message">
      {{ submitError }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useForm } from "@/composables/useForm";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "@/composables/useToast";
import MobileInput from "@/components/ui/MobileInput.vue";
import MobileButton from "@/components/ui/MobileButton.vue";
import type { RegisterCredentials } from "@/types/auth.types";

const { register } = useAuth();
const { success, error } = useToast();

const initialValues: RegisterCredentials = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const validationRules = {
  fullName: [
    { type: "required", message: "Nome é obrigatório" },
    {
      type: "minLength",
      value: 2,
      message: "Nome deve ter pelo menos 2 caracteres",
    },
  ],
  email: [
    { type: "required", message: "E-mail é obrigatório" },
    {
      type: "pattern",
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "E-mail inválido",
    },
  ],
  password: [
    { type: "required", message: "Senha é obrigatória" },
    {
      type: "minLength",
      value: 8,
      message: "Senha deve ter pelo menos 8 caracteres",
    },
    {
      custom: (value: string) => /[A-Z]/.test(value),
      message: "Senha deve conter pelo menos uma letra maiúscula",
    },
    {
      custom: (value: string) => /[a-z]/.test(value),
      message: "Senha deve conter pelo menos uma letra minúscula",
    },
    {
      custom: (value: string) => /\d/.test(value),
      message: "Senha deve conter pelo menos um número",
    },
  ],
  confirmPassword: [
    { type: "required", message: "Confirmação de senha é obrigatória" },
    {
      custom: (value: string) => {
        try {
          return value === formState.password?.value;
        } catch {
          return false;
        }
      },
      message: "Senhas não coincidem",
    },
  ],
  acceptTerms: [
    {
      custom: (value: boolean) => value === true,
      message: "Você deve aceitar os termos de uso",
    },
  ],
};

const {
  formState,
  isSubmitting,
  submitError,
  isValid,
  setTouched,
  handleSubmit: handleFormSubmit,
} = useForm(initialValues, validationRules);

const hasMinLength = computed(() => formState.password.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(formState.password.value));
const hasLowercase = computed(() => /[a-z]/.test(formState.password.value));
const hasNumber = computed(() => /\d/.test(formState.password.value));

const handleSubmit = () => {
  handleFormSubmit(async (values) => {
    try {
      await register(values);
      success("Conta criada", "Sua conta foi criada com sucesso!");
    } catch (err: any) {
      error(
        "Erro no cadastro",
        err.message || "Não foi possível criar sua conta"
      );
    }
  });
};
</script>

<style scoped>
.register-form {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.password-requirements {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: -0.5rem;
}

.requirements-title {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s ease;
}

.requirements-list li.requirement-met {
  color: #10b981;
}

.requirement-icon {
  font-size: 0.75rem;
  font-weight: bold;
  width: 1rem;
  text-align: center;
}

.terms-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  line-height: 1.4;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  background: transparent;
  cursor: pointer;
  appearance: none;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox:checked::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.terms-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.terms-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.field-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-divider {
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
}

.form-divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.form-divider span {
  background: linear-gradient(to bottom, #020917, #101725);
  padding: 0 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.social-icon {
  flex-shrink: 0;
}

.form-footer {
  text-align: center;
}

.login-prompt {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.login-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .register-form {
    padding: 1rem 0.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .terms-wrapper {
    gap: 0.5rem;
  }
}

/* Accessibility improvements */
.checkbox:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.terms-link:focus,
.login-link:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.25rem;
}
</style>

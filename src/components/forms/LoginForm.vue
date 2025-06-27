<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="form-fields">
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
        @blur="setTouched('email')"
      />

      <MobileInput
        v-model="formState.password.value"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        autocomplete="current-password"
        :error="formState.password.error"
        :disabled="isSubmitting"
        required
        @blur="setTouched('password')"
      />

      <div class="form-options">
        <label class="checkbox-wrapper">
          <input
            v-model="formState.rememberMe.value"
            type="checkbox"
            class="checkbox"
            :disabled="isSubmitting"
          />
          <span class="checkbox-label">Lembrar de mim</span>
        </label>

        <router-link
          to="/forgot-password"
          class="forgot-password-link"
          :class="{ 'pointer-events-none opacity-50': isSubmitting }"
        >
          Esqueci minha senha
        </router-link>
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
        Entrar
      </MobileButton>

      <div class="form-divider"></div>
    </div>

    <div class="form-footer">
      <p class="signup-prompt">
        Não tem uma conta?
        <router-link
          to="/register"
          class="signup-link"
          :class="{ 'pointer-events-none opacity-50': isSubmitting }"
        >
          Criar conta
        </router-link>
      </p>
    </div>

    <div v-if="submitError" class="error-message">
      {{ submitError }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "@/composables/useForm";
import { useAuth } from "@/composables/useAuth";
import MobileInput from "@/components/ui/MobileInput.vue";
import MobileButton from "@/components/ui/MobileButton.vue";
import type { LoginCredentials } from "@/types/auth.types";

const { login } = useAuth();

const initialValues: LoginCredentials = {
  email: "",
  password: "",
  rememberMe: false,
};

const validationRules = {
  email: [
    { required: true, message: "E-mail é obrigatório" },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "E-mail inválido",
    },
  ],
  password: [
    { required: true, message: "Senha é obrigatória" },
    { minLength: 6, message: "Senha deve ter pelo menos 6 caracteres" },
  ],
  rememberMe: [],
};

const {
  formState,
  isSubmitting,
  submitError,
  isValid,
  setTouched,
  handleSubmit: handleFormSubmit,
} = useForm(initialValues, validationRules);

const handleSubmit = () => {
  handleFormSubmit(async (values) => {
    await login(values);
  });
};
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
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

.checkbox-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.forgot-password-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password-link:hover {
  color: #2563eb;
  text-decoration: underline;
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

.signup-prompt {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.signup-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.signup-link:hover {
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
  .login-form {
    padding: 1rem 0.5rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-title {
    font-size: 1.5rem;
  }
}

/* Accessibility improvements */
.checkbox:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.forgot-password-link:focus,
.signup-link:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.25rem;
}
</style>

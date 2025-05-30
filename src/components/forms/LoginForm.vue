<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="form-header">
      <h2 class="form-title">Entrar</h2>
      <p class="form-subtitle">Acesse sua conta para continuar</p>
    </div>

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

      <div class="form-divider">
        <span>ou</span>
      </div>

      <MobileButton
        type="button"
        variant="outline"
        size="lg"
        :disabled="isSubmitting"
        full-width
        @click="handleSocialLogin('google')"
      >
        <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar com Google
      </MobileButton>
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
import { useForm } from '@/composables/useForm';
import { useAuth } from '@/composables/useAuth';
import MobileInput from '@/components/ui/MobileInput.vue';
import MobileButton from '@/components/ui/MobileButton.vue';
import type { LoginCredentials } from '@/types/auth.types';

const { login } = useAuth();

const initialValues: LoginCredentials = {
  email: '',
  password: '',
  rememberMe: false
};

const validationRules = {
  email: [
    { required: true, message: 'E-mail é obrigatório' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'E-mail inválido' 
    }
  ],
  password: [
    { required: true, message: 'Senha é obrigatória' },
    { minLength: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
  ],
  rememberMe: []
};

const {
  formState,
  isSubmitting,
  submitError,
  isValid,
  setTouched,
  handleSubmit: handleFormSubmit
} = useForm(initialValues, validationRules);

const handleSubmit = () => {
  handleFormSubmit(async (values) => {
    await login(values);
  });
};

const handleSocialLogin = (provider: string) => {
  // Implement social login logic
  console.log(`Social login with ${provider}`);
};
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
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
  content: '✓';
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
  content: '';
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

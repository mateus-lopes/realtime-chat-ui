<template>
  <div class="reset-password-view">
    <div class="auth-container">
      <div class="auth-background">
        <div class="background-pattern"></div>
        <div class="background-gradient"></div>
      </div>
      
      <div class="auth-content">
        <div class="form-section">
          <div class="form-header">
            <div class="icon-wrapper">
              <svg class="key-icon" viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M7,14A3,3 0 0,1 10,17A3,3 0 0,1 7,20A3,3 0 0,1 4,17A3,3 0 0,1 7,14M7,16A1,1 0 0,0 6,17A1,1 0 0,0 7,18A1,1 0 0,0 8,17A1,1 0 0,0 7,16M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63Z"/>
              </svg>
            </div>
            <h2 class="form-title">Redefinir Senha</h2>
            <p class="form-subtitle">
              Digite sua nova senha para concluir a redefinição
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="reset-form">
            <div class="form-fields">
              <MobileInput
                v-model="formState.password.value"
                type="password"
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                autocomplete="new-password"
                :error="formState.password.error"
                :disabled="isSubmitting"
                required
                @blur="setTouched('password')"
              />

              <MobileInput
                v-model="formState.confirmPassword.value"
                type="password"
                label="Confirmar Nova Senha"
                placeholder="Digite a senha novamente"
                autocomplete="new-password"
                :error="formState.confirmPassword.error"
                :disabled="isSubmitting"
                required
                @blur="setTouched('confirmPassword')"
              />

              <div class="password-requirements" v-if="formState.password.value">
                <p class="requirements-title">Sua nova senha deve ter:</p>
                <ul class="requirements-list">
                  <li :class="{ 'requirement-met': hasMinLength }">
                    <span class="requirement-icon">{{ hasMinLength ? '✓' : '○' }}</span>
                    Pelo menos 8 caracteres
                  </li>
                  <li :class="{ 'requirement-met': hasUppercase }">
                    <span class="requirement-icon">{{ hasUppercase ? '✓' : '○' }}</span>
                    Uma letra maiúscula
                  </li>
                  <li :class="{ 'requirement-met': hasLowercase }">
                    <span class="requirement-icon">{{ hasLowercase ? '✓' : '○' }}</span>
                    Uma letra minúscula
                  </li>
                  <li :class="{ 'requirement-met': hasNumber }">
                    <span class="requirement-icon">{{ hasNumber ? '✓' : '○' }}</span>
                    Um número
                  </li>
                </ul>
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
                Redefinir Senha
              </MobileButton>

              <MobileButton
                type="button"
                variant="outline"
                size="lg"
                :disabled="isSubmitting"
                full-width
                @click="goToLogin"
              >
                Voltar ao Login
              </MobileButton>
            </div>

            <div v-if="submitError" class="error-message">
              {{ submitError }}
            </div>

            <div v-if="resetSuccess" class="success-message">
              <div class="success-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
                </svg>
              </div>
              <p>Senha redefinida com sucesso! Redirecionando para o login...</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from '@/composables/useForm';
import { useAuth } from '@/composables/useAuth';
import MobileInput from '@/components/ui/MobileInput.vue';
import MobileButton from '@/components/ui/MobileButton.vue';
import type { ResetPasswordRequest } from '@/types/auth.types';

const route = useRoute();
const router = useRouter();
const { resetPassword, requireGuest } = useAuth();

const resetSuccess = ref(false);
const token = route.params.token as string;

const initialValues: ResetPasswordRequest = {
  token: token,
  password: '',
  confirmPassword: ''
};

const validationRules = {
  token: [],
  password: [
    { required: true, message: 'Nova senha é obrigatória' },
    { minLength: 8, message: 'Senha deve ter pelo menos 8 caracteres' },
    { 
      custom: (value: string) => /[A-Z]/.test(value), 
      message: 'Senha deve conter pelo menos uma letra maiúscula' 
    },
    { 
      custom: (value: string) => /[a-z]/.test(value), 
      message: 'Senha deve conter pelo menos uma letra minúscula' 
    },
    { 
      custom: (value: string) => /\d/.test(value), 
      message: 'Senha deve conter pelo menos um número' 
    }
  ],
  confirmPassword: [
    { required: true, message: 'Confirmação de senha é obrigatória' },
    { 
      custom: (value: string) => value === formState.password?.value, 
      message: 'Senhas não coincidem' 
    }
  ]
};

const {
  formState,
  isSubmitting,
  submitError,
  isValid,
  setTouched,
  handleSubmit: handleFormSubmit
} = useForm(initialValues, validationRules);

// Password strength indicators
const hasMinLength = computed(() => formState.password.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(formState.password.value));
const hasLowercase = computed(() => /[a-z]/.test(formState.password.value));
const hasNumber = computed(() => /\d/.test(formState.password.value));

onMounted(() => {
  requireGuest();
  
  // Validate token
  if (!token) {
    router.push('/forgot-password');
  }
});

const handleSubmit = () => {
  handleFormSubmit(async (values) => {
    await resetPassword(values);
    resetSuccess.value = true;
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  });
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.reset-password-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
  animation: float 25s ease-in-out infinite;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.05) 0%,
    rgba(59, 130, 246, 0.05) 100%
  );
}

.form-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.key-icon {
  color: #10b981;
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
  line-height: 1.5;
}

.reset-form {
  width: 100%;
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

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
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

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.5rem;
  color: #10b981;
  font-size: 0.875rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-icon {
  flex-shrink: 0;
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .reset-password-view {
    padding: 0.5rem;
  }
  
  .form-section {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .icon-wrapper svg {
    width: 40px;
    height: 40px;
  }
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

.form-section {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .background-pattern {
    animation: none;
  }
  
  .form-section {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-section {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
  }
}
</style>

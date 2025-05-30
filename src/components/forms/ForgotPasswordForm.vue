<template>
  <form @submit.prevent="handleSubmit" class="forgot-password-form">
    <div class="form-header">
      <div class="icon-wrapper">
        <svg class="lock-icon" viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
        </svg>
      </div>
      <h2 class="form-title">Esqueci minha senha</h2>
      <p class="form-subtitle">
        Digite seu e-mail e enviaremos um link para redefinir sua senha
      </p>
    </div>

    <div v-if="!emailSent" class="form-fields">
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

      <div class="help-text">
        <p>Você receberá um e-mail com instruções para redefinir sua senha.</p>
      </div>
    </div>

    <div v-else class="success-message">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
        </svg>
      </div>
      <h3 class="success-title">E-mail enviado!</h3>
      <p class="success-text">
        Enviamos um link de redefinição de senha para 
        <strong>{{ formState.email.value }}</strong>
      </p>
      <p class="success-instructions">
        Verifique sua caixa de entrada e siga as instruções no e-mail. 
        Se não encontrar o e-mail, verifique sua pasta de spam.
      </p>
      
      <div class="resend-section">
        <p class="resend-text">Não recebeu o e-mail?</p>
        <MobileButton
          type="button"
          variant="ghost"
          size="sm"
          :disabled="resendCooldown > 0"
          @click="handleResend"
        >
          {{ resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar e-mail' }}
        </MobileButton>
      </div>
    </div>

    <div class="form-actions">
      <MobileButton
        v-if="!emailSent"
        type="submit"
        variant="primary"
        size="lg"
        :loading="isSubmitting"
        :disabled="!isValid || isSubmitting"
        full-width
      >
        Enviar link de redefinição
      </MobileButton>

      <MobileButton
        type="button"
        variant="outline"
        size="lg"
        :disabled="isSubmitting"
        full-width
        @click="goBack"
      >
        {{ emailSent ? 'Voltar ao login' : 'Voltar' }}
      </MobileButton>
    </div>

    <div v-if="submitError" class="error-message">
      {{ submitError }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from '@/composables/useForm';
import { useAuth } from '@/composables/useAuth';
import MobileInput from '@/components/ui/MobileInput.vue';
import MobileButton from '@/components/ui/MobileButton.vue';
import type { ForgotPasswordRequest } from '@/types/auth.types';

const router = useRouter();
const { forgotPassword } = useAuth();

const emailSent = ref(false);
const resendCooldown = ref(0);
let resendTimer: NodeJS.Timeout | null = null;

const initialValues: ForgotPasswordRequest = {
  email: ''
};

const validationRules = {
  email: [
    { required: true, message: 'E-mail é obrigatório' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'E-mail inválido' 
    }
  ]
};

const {
  formState,
  isSubmitting,
  submitError,
  isValid,
  setTouched,
  handleSubmit: handleFormSubmit,
  clearErrors
} = useForm(initialValues, validationRules);

const handleSubmit = () => {
  handleFormSubmit(async (values) => {
    await forgotPassword(values);
    emailSent.value = true;
    startResendCooldown();
  });
};

const handleResend = async () => {
  if (resendCooldown.value > 0) return;
  
  try {
    clearErrors();
    await forgotPassword({ email: formState.email.value });
    startResendCooldown();
  } catch (error) {
    console.error('Resend error:', error);
  }
};

const startResendCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown
  
  resendTimer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer!);
      resendTimer = null;
    }
  }, 1000);
};

const goBack = () => {
  if (emailSent.value) {
    router.push('/login');
  } else {
    router.back();
  }
};

onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer);
  }
});
</script>

<style scoped>
.forgot-password-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.lock-icon {
  color: #3b82f6;
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

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.help-text {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.help-text p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.success-message {
  text-align: center;
  margin-bottom: 2rem;
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.success-icon svg {
  color: #10b981;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.success-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.success-text strong {
  color: #3b82f6;
  font-weight: 600;
}

.success-instructions {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.resend-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.resend-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
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

/* Mobile optimizations */
@media (max-width: 480px) {
  .forgot-password-form {
    padding: 1rem 0.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .icon-wrapper svg {
    width: 40px;
    height: 40px;
  }
  
  .success-icon svg {
    width: 56px;
    height: 56px;
  }
}

/* Animation for success state */
.success-message {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus improvements */
.form-actions button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

<template>
  <div class="forgot-password-view">
    <div class="auth-container">
      <div class="auth-background">
        <div class="background-pattern"></div>
        <div class="background-gradient"></div>
      </div>
      
      <div class="auth-content">
        <div class="form-section">
          <ForgotPasswordForm />
        </div>
      </div>

      <!-- Help section -->
      <div class="help-section">
        <h3 class="help-title">Precisa de ajuda?</h3>
        <div class="help-grid">
          <div class="help-item">
            <div class="help-icon">📧</div>
            <h4>Verifique seu e-mail</h4>
            <p>O link pode estar na pasta de spam ou promoções</p>
          </div>
          <div class="help-item">
            <div class="help-icon">⏰</div>
            <h4>Aguarde alguns minutos</h4>
            <p>O e-mail pode demorar até 5 minutos para chegar</p>
          </div>
          <div class="help-item">
            <div class="help-icon">🔄</div>
            <h4>Tente novamente</h4>
            <p>Você pode solicitar um novo link a qualquer momento</p>
          </div>
          <div class="help-item">
            <div class="help-icon">💬</div>
            <h4>Entre em contato</h4>
            <p>Nossa equipe está pronta para ajudar</p>
          </div>
        </div>
        
        <div class="contact-section">
          <p class="contact-text">
            Ainda com problemas? 
            <a href="mailto:suporte@chatapp.com" class="contact-link">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm.vue';

const { requireGuest } = useAuth();

onMounted(() => {
  // Redirect if already authenticated
  requireGuest();
});
</script>

<style scoped>
.forgot-password-view {
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
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
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
    radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
  animation: float 30s ease-in-out infinite;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.03) 0%,
    rgba(16, 185, 129, 0.03) 100%
  );
}

.auth-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form-section {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.help-section {
  width: 100%;
  text-align: center;
}

.help-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 2rem;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.help-item {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
}

.help-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.help-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.help-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.help-item p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
}

.contact-section {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.contact-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

.contact-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Tablet and desktop layout */
@media (min-width: 768px) {
  .auth-container {
    gap: 4rem;
  }
  
  .help-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .help-title {
    font-size: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .forgot-password-view {
    padding: 2rem;
  }
  
  .help-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .forgot-password-view {
    padding: 0.5rem;
  }
  
  .auth-container {
    gap: 2rem;
  }
  
  .form-section {
    padding: 0.5rem;
    border-radius: 1rem;
  }
  
  .help-title {
    font-size: 1.25rem;
  }
  
  .help-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .help-item {
    padding: 1rem;
  }
  
  .help-icon {
    font-size: 1.5rem;
  }
  
  .contact-section {
    padding: 1rem;
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

.auth-content {
  animation: fadeInUp 0.8s ease-out;
}

.help-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
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

/* Staggered animation for help items */
.help-item:nth-child(1) { animation: fadeInUp 0.6s ease-out 0.4s both; }
.help-item:nth-child(2) { animation: fadeInUp 0.6s ease-out 0.5s both; }
.help-item:nth-child(3) { animation: fadeInUp 0.6s ease-out 0.6s both; }
.help-item:nth-child(4) { animation: fadeInUp 0.6s ease-out 0.7s both; }

.contact-section {
  animation: fadeInUp 0.6s ease-out 0.8s both;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .background-pattern {
    animation: none;
  }
  
  .auth-content,
  .help-section,
  .help-item,
  .contact-section {
    animation: none;
  }
  
  .help-item:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-section,
  .help-item,
  .contact-section {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
  }
}

/* Focus improvements */
.contact-link:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.25rem;
}
</style>

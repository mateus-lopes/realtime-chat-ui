<template>
  <div class="login-view">
    <div class="auth-container">
      <div class="auth-background">
        <div class="background-pattern"></div>
        <div class="background-gradient"></div>
      </div>
      
      <div class="auth-content">
        <div class="brand-section">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
          </div>
          <h1 class="brand-title">ChatApp</h1>
          <p class="brand-subtitle">Conecte-se com seus amigos em tempo real</p>
        </div>

        <div class="form-section">
          <LoginForm />
        </div>
      </div>

      <!-- Mobile-specific features -->
      <div class="mobile-features">
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <span>Otimizado para mobile</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <span>Mensagens instantâneas</span>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <span>Seguro e privado</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import LoginForm from '@/components/forms/LoginForm.vue';

const { requireGuest } = useAuth();

onMounted(() => {
  // Redirect if already authenticated
  requireGuest();
});
</script>

<style scoped>
.login-view {
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
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
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
    radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
}

.auth-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.brand-section {
  text-align: center;
  margin-bottom: 1rem;
}

.brand-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.brand-logo svg {
  color: #3b82f6;
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.125rem;
  font-weight: 400;
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

.mobile-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.feature-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

/* Tablet and desktop layout */
@media (min-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
  }
  
  .brand-section {
    text-align: left;
    margin-bottom: 0;
  }
  
  .brand-title {
    font-size: 3.5rem;
  }
  
  .brand-subtitle {
    font-size: 1.25rem;
  }
  
  .mobile-features {
    grid-column: 1 / -1;
    margin-top: 3rem;
  }
}

@media (min-width: 1024px) {
  .login-view {
    padding: 2rem;
  }
  
  .brand-title {
    font-size: 4rem;
  }
  
  .mobile-features {
    gap: 3rem;
  }
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .login-view {
    padding: 0.5rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .brand-subtitle {
    font-size: 1rem;
  }
  
  .form-section {
    padding: 0.5rem;
    border-radius: 1rem;
  }
  
  .mobile-features {
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .feature-item {
    font-size: 0.75rem;
  }
  
  .feature-icon {
    font-size: 1.25rem;
  }
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

.auth-content {
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
  
  .auth-content {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-section {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
  }
  
  .brand-title {
    -webkit-text-fill-color: white;
    background: none;
  }
}
</style>

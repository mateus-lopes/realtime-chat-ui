<template>
  <div class="register-view">
    <div class="auth-container">
      <div class="auth-background">
        <div class="background-pattern"></div>
        <div class="background-gradient"></div>
      </div>

      <div class="auth-content">
        <div class="brand-section">
          <h1 class="brand-title">Junte-se ao ZapDosAmigos</h1>
        </div>

        <div class="form-section">
          <RegisterForm />
        </div>
      </div>

      <div class="benefits-section">
        <h3 class="benefits-title">Por que escolher o ZapDosAmigos?</h3>
        <div class="benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon">🚀</div>
            <h4>Rápido e Confiável</h4>
            <p>Mensagens entregues instantaneamente</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🔐</div>
            <h4>Segurança Total</h4>
            <p>Suas conversas são criptografadas</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🌍</div>
            <h4>Acesso Global</h4>
            <p>Conecte-se de qualquer lugar</p>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">📱</div>
            <h4>Mobile First</h4>
            <p>Perfeito para dispositivos móveis</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import RegisterForm from "@/components/forms/RegisterForm.vue";

const { requireGuest } = useAuth();

onMounted(() => {
  requireGuest();
});
</script>

<style scoped>
.register-view {
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3em;
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
  background-image: radial-gradient(
      circle at 20% 80%,
      rgba(139, 92, 246, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(16, 185, 129, 0.05) 0%,
      transparent 50%
    );
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
    rgba(139, 92, 246, 0.05) 0%,
    rgba(59, 130, 246, 0.05) 50%,
    rgba(16, 185, 129, 0.03) 100%
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
  color: #8b5cf6;
  filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3));
}

.brand-title {
  font-size: 3em !important;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0 auto;
  line-height: 1.5;
}

.form-section {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.benefits-section {
  margin-top: 3rem;
  text-align: center;
}

.benefits-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 2rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.benefit-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
}

.benefit-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.benefit-item h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.benefit-item p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
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
    margin: 0;
  }

  .benefits-section {
    grid-column: 1 / -1;
    margin-top: 4rem;
  }

  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .register-view {
    padding: 2rem;
  }

  .brand-title {
    font-size: 4rem;
  }

  .benefits-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

/* Mobile optimizations */
@media (max-width: 480px) {
  .register-view {
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

  .benefits-section {
    margin-top: 2rem;
  }

  .benefits-title {
    font-size: 1.25rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .benefit-item {
    padding: 1rem;
  }

  .benefit-icon {
    font-size: 1.5rem;
  }
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-15px) rotate(1deg);
  }
  66% {
    transform: translateY(10px) rotate(-1deg);
  }
}

.auth-content {
  animation: fadeInUp 0.8s ease-out;
}

.benefits-section {
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

/* Staggered animation for benefit items */
.benefit-item:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}
.benefit-item:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}
.benefit-item:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.6s both;
}
.benefit-item:nth-child(4) {
  animation: fadeInUp 0.6s ease-out 0.7s both;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .background-pattern {
    animation: none;
  }

  .auth-content,
  .benefits-section,
  .benefit-item {
    animation: none;
  }

  .benefit-item:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-section,
  .benefit-item {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
  }

  .brand-title {
    -webkit-text-fill-color: white;
    background: none;
  }
}
</style>

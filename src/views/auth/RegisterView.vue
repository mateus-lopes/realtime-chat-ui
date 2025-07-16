<template>
  <div class="register-view">
    <div class="auth-container">
      <div class="auth-background">
        <div class="background-pattern"></div>
        <div class="background-gradient"></div>
      </div>
      <div class="auth-content">
        <div class="brand-section">
          <h1 class="brand-title">realtime-chat</h1>
        </div>
        <div class="form-section">
          <RegisterForm />
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
  background: #000;
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

.brand-title {
  font-size: 3em !important;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
}

@media (min-width: 1024px) {
  .register-view {
    padding: 2rem;
  }

  .brand-title {
    font-size: 2.5rem;
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

  .form-section {
    padding: 0.5rem;
    border-radius: 1rem;
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

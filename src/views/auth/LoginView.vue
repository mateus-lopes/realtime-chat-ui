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
            <h1 class="brand-title">realtime-chat</h1>
          </div>
        </div>
        <div class="form-section">
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import LoginForm from "@/components/forms/LoginForm.vue";

const { requireGuest } = useAuth();

onMounted(() => {
  requireGuest();
});
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;
  padding: 3em;
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
  background: black;
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
  animation: fadeInUp 0.8s ease-out;
}

.brand-section {
  text-align: center;
  margin-bottom: 1rem;
}

.brand-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
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
  max-width: 400px;
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
  .login-view {
    padding: 2rem;
  }

  .brand-title {
    font-size: 4rem;
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

  .form-section {
    padding: 0.5rem;
    border-radius: 1rem;
  }
}

/* Animations */
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

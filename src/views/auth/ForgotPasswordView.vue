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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm.vue";

const { requireGuest } = useAuth();

onMounted(() => {
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
  background-image: radial-gradient(
      circle at 30% 70%,
      rgba(59, 130, 246, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 30%,
      rgba(16, 185, 129, 0.08) 0%,
      transparent 50%
    );
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
  animation: fadeInUp 0.8s ease-out;
}

.form-section {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 0 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Tablet and desktop layout */
@media (min-width: 768px) {
  .auth-container {
    gap: 4rem;
  }
}

@media (min-width: 1024px) {
  .forgot-password-view {
    padding: 2rem;
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
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
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
</style>

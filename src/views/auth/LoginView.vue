<template>
  <div
    class="min-h-screen flex items-center justify-center relative mx-auto overflow-hidden bg-black"
  >
    <div
      class="w-full flex flex-col gap-8 relative z-10 p-12 md:grid md:grid-cols-2 md:items-center md:gap-16"
    >
      <div class="fixed inset-0 -z-10">
        <div
          class="absolute inset-0 animate-float"
          style="
            background-image: radial-gradient(
                circle at 25% 25%,
                rgba(59, 130, 246, 0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                circle at 75% 75%,
                rgba(139, 92, 246, 0.1) 0%,
                transparent 50%
              );
          "
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5"
        ></div>
      </div>

      <div class="flex flex-col items-center md:items-start gap-8">
        <div class="text-center md:text-left mb-4">
          <div class="flex justify-center md:justify-start items-center gap-4">
            <svg
              viewBox="0 0 24 24"
              width="64"
              height="64"
              class="text-blue-500 drop-shadow-lg pb-2"
            >
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"
              />
            </svg>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2"
            >
              realtime-chat
            </h1>
          </div>
          <p class="text-white/70 text-base md:text-lg font-normal">
            Simple app to chat with friends in real-time
          </p>
        </div>
        <div
          class="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-lg"
        >
          <LoginForm />
        </div>
      </div>

      <div class="flex justify-center gap-8 flex-wrap md:col-span-2 mt-4">
        <div
          class="flex flex-col items-center gap-2 text-center text-white/70 text-sm"
        >
          <div class="text-xl mb-1">📱</div>
          <span>Mobile optimized</span>
        </div>
        <div
          class="flex flex-col items-center gap-2 text-center text-white/70 text-sm"
        >
          <div class="text-xl mb-1">⚡</div>
          <span>Instant messages</span>
        </div>
        <div
          class="flex flex-col items-center gap-2 text-center text-white/70 text-sm"
        >
          <div class="text-xl mb-1">🔒</div>
          <span>Secure and private</span>
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
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}
.animate-float {
  animation: float 20s ease-in-out infinite;
}
</style>

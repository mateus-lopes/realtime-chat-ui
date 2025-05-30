<template>
  <div class="not-found-view">
    <div class="not-found-container">
      <div class="not-found-background">
        <div class="background-pattern"></div>
        <div class="background-gradient"></div>
      </div>
      
      <div class="not-found-content">
        <div class="error-illustration">
          <div class="error-number">404</div>
          <div class="error-icon">
            <svg viewBox="0 0 24 24" width="80" height="80">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V9H11V7M11,11H13V17H11V11Z"/>
            </svg>
          </div>
        </div>

        <div class="error-message">
          <h1 class="error-title">Página não encontrada</h1>
          <p class="error-description">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div class="error-actions">
          <MobileButton
            variant="primary"
            size="lg"
            @click="goHome"
            full-width
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
            Ir para o Início
          </MobileButton>

          <MobileButton
            variant="outline"
            size="lg"
            @click="goBack"
            full-width
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Voltar
          </MobileButton>
        </div>

        <div class="helpful-links">
          <h3 class="links-title">Links úteis:</h3>
          <div class="links-grid">
            <router-link to="/login" class="helpful-link">
              <div class="link-icon">🔐</div>
              <span>Login</span>
            </router-link>
            
            <router-link to="/register" class="helpful-link">
              <div class="link-icon">👤</div>
              <span>Criar Conta</span>
            </router-link>
            
            <router-link to="/forgot-password" class="helpful-link">
              <div class="link-icon">🔑</div>
              <span>Recuperar Senha</span>
            </router-link>
            
            <a href="mailto:suporte@chatapp.com" class="helpful-link">
              <div class="link-icon">📧</div>
              <span>Suporte</span>
            </a>
          </div>
        </div>

        <div class="search-section">
          <h3 class="search-title">Ou tente procurar:</h3>
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Digite o que você está procurando..."
              @keyup.enter="handleSearch"
              class="search-input"
            />
            <button @click="handleSearch" class="search-button">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MobileButton from '@/components/ui/MobileButton.vue';

const router = useRouter();
const searchQuery = ref('');

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // In a real app, this would redirect to a search page
    // For now, we'll just redirect to home
    console.log('Searching for:', searchQuery.value);
    router.push('/');
  }
};
</script>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.not-found-container {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.not-found-background {
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
    radial-gradient(circle at 25% 75%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
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
    rgba(239, 68, 68, 0.05) 0%,
    rgba(59, 130, 246, 0.05) 100%
  );
}

.not-found-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.error-illustration {
  margin-bottom: 2rem;
}

.error-number {
  font-size: 6rem;
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-icon {
  color: #ef4444;
  opacity: 0.8;
}

.error-message {
  margin-bottom: 2rem;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.error-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.helpful-links {
  margin-bottom: 2rem;
}

.links-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.helpful-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.helpful-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.link-icon {
  font-size: 1.5rem;
}

.search-section {
  text-align: center;
}

.search-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-button {
  background: #3b82f6;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.search-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .not-found-view {
    padding: 0.5rem;
  }
  
  .not-found-content {
    padding: 1.5rem;
    border-radius: 1rem;
  }
  
  .error-number {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-button {
    min-width: auto;
  }
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(1deg);
  }
}

.not-found-content {
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
  
  .not-found-content {
    animation: none;
  }
  
  .helpful-link:hover {
    transform: none;
  }
  
  .search-button:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .not-found-content,
  .helpful-link {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
  }
  
  .error-number {
    -webkit-text-fill-color: white;
    background: none;
  }
}
</style>

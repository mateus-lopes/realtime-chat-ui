<template>
  <div class="chat-view">
    <div class="chat-container">
      <header class="chat-header">
        <button @click="goBack" class="back-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
        </button>
        <div class="chat-info">
          <h1 class="chat-title">Chat</h1>
          <p class="chat-subtitle">Em breve: chat em tempo real</p>
        </div>
      </header>

      <main class="chat-main">
        <div class="coming-soon">
          <div class="coming-soon-icon">
            <svg viewBox="0 0 24 24" width="64" height="64">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          </div>
          
          <h2>Chat em Tempo Real</h2>
          <p>Esta funcionalidade está em desenvolvimento. Em breve você poderá:</p>
          
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">💬</span>
              <span>Enviar mensagens instantâneas</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📷</span>
              <span>Compartilhar fotos e arquivos</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔔</span>
              <span>Receber notificações em tempo real</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">👥</span>
              <span>Criar grupos de conversa</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎤</span>
              <span>Mensagens de voz</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📍</span>
              <span>Compartilhar localização</span>
            </div>
          </div>

          <div class="demo-section">
            <h3>Demonstração da Interface</h3>
            <div class="chat-demo">
              <div class="message message-received">
                <div class="message-content">
                  <p>Olá! Como você está?</p>
                  <span class="message-time">14:30</span>
                </div>
              </div>
              
              <div class="message message-sent">
                <div class="message-content">
                  <p>Oi! Estou bem, obrigado! E você?</p>
                  <span class="message-time">14:32</span>
                </div>
              </div>
              
              <div class="message message-received">
                <div class="message-content">
                  <p>Também estou bem! Que bom ver você por aqui 😊</p>
                  <span class="message-time">14:33</span>
                </div>
              </div>
            </div>
            
            <div class="input-demo">
              <div class="demo-input">
                <input type="text" placeholder="Digite sua mensagem..." disabled />
                <button disabled>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { requireAuth } = useAuth();

onMounted(() => {
  requireAuth();
});

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.chat-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #020917, #101725);
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.chat-info {
  flex: 1;
}

.chat-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.chat-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

.chat-main {
  flex: 1;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.coming-soon {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.coming-soon-icon {
  color: #3b82f6;
  margin-bottom: 1.5rem;
}

.coming-soon h2 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.coming-soon > p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: left;
}

.feature-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.feature-item span:last-child {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.demo-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
}

.demo-section h3 {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.chat-demo {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  display: flex;
  max-width: 70%;
}

.message-received {
  align-self: flex-start;
}

.message-sent {
  align-self: flex-end;
}

.message-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  position: relative;
}

.message-sent .message-content {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.message-content p {
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.message-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.input-demo {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
}

.demo-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.demo-input input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
}

.demo-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.demo-input button {
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .chat-main {
    padding: 1rem 0.5rem;
  }
  
  .coming-soon h2 {
    font-size: 1.5rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .demo-section {
    padding: 1rem;
  }
  
  .message {
    max-width: 85%;
  }
}
</style>

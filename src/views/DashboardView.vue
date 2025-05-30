<template>
  <div class="dashboard-view">
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">Dashboard</h1>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <button @click="logout" class="logout-btn">Sair</button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="welcome-section">
          <h2>Bem-vindo ao ChatApp!</h2>
          <p>Esta é uma implementação básica do dashboard. Em breve teremos:</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h3>Chat em Tempo Real</h3>
              <p>Conversas instantâneas com seus contatos</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3>Gerenciar Contatos</h3>
              <p>Adicione e organize seus contatos</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🔔</div>
              <h3>Notificações</h3>
              <p>Receba alertas de novas mensagens</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">⚙️</div>
              <h3>Configurações</h3>
              <p>Personalize sua experiência</p>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Ações Rápidas</h3>
          <div class="actions-grid">
            <router-link to="/chat" class="action-btn">
              <span class="action-icon">💬</span>
              Iniciar Chat
            </router-link>
            
            <router-link to="/profile" class="action-btn">
              <span class="action-icon">👤</span>
              Ver Perfil
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { userName, logout, requireAuth } = useAuth();

onMounted(() => {
  requireAuth();
});
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #020917, #101725);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

.welcome-section h2 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.welcome-section p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: white;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
}

.quick-actions {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

.quick-actions h3 {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  text-decoration: none;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.action-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-icon {
  font-size: 1.25rem;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 0.5rem;
  }
  
  .dashboard-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .welcome-section,
  .quick-actions {
    padding: 1.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>

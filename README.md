# realtime-chat-ui

Uma aplicação de chat em tempo real construída com Vue 3, TypeScript, Rsbuild e design mobile-first.

## 🚀 Características

- **Mobile-First**: Interface otimizada para dispositivos móveis
- **Autenticação Completa**: Login, registro e recuperação de senha
- **Offline Support**: Funciona mesmo sem conexão
- **TypeScript**: Tipagem completa para melhor DX
- **Testes**: Cobertura completa com Jest
- **Responsivo**: Adapta-se perfeitamente do mobile ao desktop

## 📱 Funcionalidades de Autenticação

### ✅ Implementado

- [x] **Login** - Formulário de login com validação
- [x] **Registro** - Criação de conta com validação de senha
- [x] **Esqueci Minha Senha** - Recuperação de senha por email
- [x] **Validação em Tempo Real** - Feedback instantâneo
- [x] **Gerenciamento de Estado** - Pinia store para autenticação
- [x] **Offline Queue** - Requisições em fila quando offline
- [x] **Testes Unitários** - Cobertura completa dos componentes

### 🔄 Próximos Passos

- [ ] Reset de senha (view)
- [ ] Dashboard principal
- [ ] Chat em tempo real
- [ ] Perfil do usuário
- [ ] Notificações push

## 🛠️ Tecnologias

- **Vue 3** - Framework reativo
- **TypeScript** - Tipagem estática
- **Rsbuild** - Build tool moderno
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **Jest** - Testes unitários
- **CSS Mobile-First** - Design responsivo

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface
│   │   ├── MobileButton.vue
│   │   ├── MobileInput.vue
│   │   └── LoadingSpinner.vue
│   └── forms/          # Formulários
│       ├── LoginForm.vue
│       ├── RegisterForm.vue
│       └── ForgotPasswordForm.vue
├── views/              # Páginas/Views
│   └── auth/           # Views de autenticação
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       └── ForgotPasswordView.vue
├── stores/             # Pinia stores
│   └── auth.store.ts   # Store de autenticação
├── services/           # Serviços de API
│   ├── api.service.ts  # Cliente HTTP base
│   └── auth.service.ts # Serviço de autenticação
├── composables/        # Composables Vue
│   ├── useAuth.ts      # Composable de autenticação
│   └── useForm.ts      # Composable de formulários
├── types/              # Definições TypeScript
│   ├── auth.types.ts   # Tipos de autenticação
│   └── api.types.ts    # Tipos de API
└── router/             # Configuração de rotas
    └── index.ts        # Router principal
```

## 🚀 Setup

Instale as dependências:

```bash
npm install
```

## 🏃‍♂️ Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🧪 Testes

Execute os testes:

```bash
npm run test
```

Execute os testes em modo watch:

```bash
npm run test:watch
```

Execute os testes com cobertura:

```bash
npm run test:coverage
```

## 🏗️ Build

Construa para produção:

```bash
npm run build
```

Visualize o build de produção:

```bash
npm run preview
```

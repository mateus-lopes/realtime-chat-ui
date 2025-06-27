// Vue Router Configuration for Mobile-First Chat App

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const LoginView = () => import("@/views/auth/LoginView.vue");
const RegisterView = () => import("@/views/auth/RegisterView.vue");
const ForgotPasswordView = () => import("@/views/auth/ForgotPasswordView.vue");
const ChatView = () => import("@/views/DashboardView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const TestView = () => import("@/views/TestView.vue");

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      requiresGuest: true,
      title: "Entrar - ChatApp",
      description: "Faça login na sua conta do ChatApp",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      requiresGuest: true,
      title: "Criar Conta - ChatApp",
      description: "Crie sua conta no ChatApp e comece a conversar",
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordView,
    meta: {
      requiresGuest: true,
      title: "Esqueci Minha Senha - ChatApp",
      description: "Recupere sua senha do ChatApp",
    },
  },
  {
    path: "/chat",
    name: "Dashboard",
    component: ChatView,
    meta: {
      requiresAuth: true,
      title: "Dashboard - ChatApp",
      description: "Sua central de conversas",
    },
  },
  {
    path: "/test",
    name: "Test",
    component: TestView,
    meta: {
      requiresAuth: true,
      title: "Test - ChatApp",
      description: "Test view",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: {
      requiresAuth: true,
      title: "Perfil - ChatApp",
      description: "Gerencie seu perfil",
    },
  },
  // 404 page
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
    meta: {
      title: "Página não encontrada - ChatApp",
      description: "A página que você procura não existe",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.name !== from.name) {
      return { top: 0, behavior: "smooth" };
    }

    return {};
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", to.meta.description as string);
    }
  }

  if (!authStore.isAuthenticated && !authStore.isLoading) {
    try {
      await authStore.initializeAuth();
    } catch (error) {
      console.error("Auth initialization failed:", error);
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    const redirectTo = (to.query.redirect as string) || "/chat";
    next(redirectTo);
    return;
  }

  next();
});

router.afterEach((to, from) => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    if (to.name === "Chat") {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    } else {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  }

  if (typeof gtag !== "undefined") {
    gtag("config", "GA_MEASUREMENT_ID", {
      page_title: to.meta.title,
      page_location: window.location.href,
      page_path: to.path,
    });
  }

  // Mobile-specific: Hide address bar on navigation
  if (window.innerHeight < window.innerWidth) {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("online", () => {
    console.log("Back online");
  });

  window.addEventListener("offline", () => {
    console.log("Gone offline");
  });
}

router.beforeResolve((to, from, next) => {
  const authStore = useAuthStore();

  if (
    authStore.isAuthenticated &&
    ["Login", "Register", "ForgotPassword"].includes(to.name as string) &&
    from.name &&
    !["Login", "Register", "ForgotPassword"].includes(from.name as string)
  ) {
    next("/chat");
    return;
  }

  next();
});

export default router;

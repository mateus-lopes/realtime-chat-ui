// Vue Router Configuration for Mobile-First Chat App

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

// Lazy load views for better performance
const LoginView = () => import("@/views/auth/LoginView.vue");
const RegisterView = () => import("@/views/auth/RegisterView.vue");
const ForgotPasswordView = () => import("@/views/auth/ForgotPasswordView.vue");

// Placeholder for future views
const DashboardView = () => import("@/views/DashboardView.vue");
const ChatView = () => import("@/views/ChatView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");

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
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
      title: "Dashboard - ChatApp",
      description: "Sua central de conversas",
    },
  },
  {
    path: "/chat/:id?",
    name: "Chat",
    component: ChatView,
    meta: {
      requiresAuth: true,
      title: "Chat - ChatApp",
      description: "Conversa em tempo real",
    },
  },
  // {
  //   path: "/profile",
  //   name: "Profile",
  //   component: ProfileView,
  //   meta: {
  //     requiresAuth: true,
  //     title: "Perfil - ChatApp",
  //     description: "Gerencie seu perfil",
  //   },
  // },
  // {
  //   path: "/reset-password/:token",
  //   name: "ResetPassword",
  //   component: () => import("@/views/auth/ResetPasswordView.vue"),
  //   meta: {
  //     requiresGuest: true,
  //     title: "Redefinir Senha - ChatApp",
  //     description: "Defina uma nova senha para sua conta",
  //   },
  // },
  // 404 page
  // {
  //   path: "/:pathMatch(.*)*",
  //   name: "NotFound",
  //   component: () => import("@/views/NotFoundView.vue"),
  //   meta: {
  //     title: "Página não encontrada - ChatApp",
  //     description: "A página que você procura não existe",
  //   },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Mobile-friendly scroll behavior
    if (savedPosition) {
      return savedPosition;
    }

    // Scroll to top for new routes
    if (to.name !== from.name) {
      return { top: 0, behavior: "smooth" };
    }

    // Preserve scroll position for same route
    return {};
  },
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Update page title and meta description
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", to.meta.description as string);
    }
  }

  // Initialize auth if not already done
  if (!authStore.isAuthenticated && !authStore.isLoading) {
    try {
      await authStore.initializeAuth();
    } catch (error) {
      console.error("Auth initialization failed:", error);
    }
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with return URL
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Check guest requirements (redirect authenticated users)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect to dashboard or intended destination
    const redirectTo = (to.query.redirect as string) || "/dashboard";
    next(redirectTo);
    return;
  }

  next();
});

// After navigation
router.afterEach((to, from) => {
  // Mobile-specific: Update viewport meta tag for different pages
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // Adjust viewport for different page types
    if (to.name === "Chat") {
      // Prevent zoom on chat input focus
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    } else {
      // Default viewport
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  }

  // Track page views (placeholder for analytics)
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

// Handle network status changes
if ("serviceWorker" in navigator) {
  window.addEventListener("online", () => {
    // Retry failed requests when back online
    console.log("Back online");
  });

  window.addEventListener("offline", () => {
    // Show offline indicator
    console.log("Gone offline");
  });
}

// Mobile-specific: Handle back button
router.beforeResolve((to, from, next) => {
  // Prevent back navigation to auth pages when authenticated
  const authStore = useAuthStore();

  if (
    authStore.isAuthenticated &&
    ["Login", "Register", "ForgotPassword"].includes(to.name as string) &&
    from.name &&
    !["Login", "Register", "ForgotPassword"].includes(from.name as string)
  ) {
    // User is trying to go back to auth pages while authenticated
    next("/dashboard");
    return;
  }

  next();
});

export default router;

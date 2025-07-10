import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

/**
 * Composable mínimo para autenticação
 * Mantém apenas funções que agregam valor real:
 * - Lógica de redirecionamento após ações
 * - Guards de navegação
 * - Inicialização
 *
 * Para acessar dados simples, use diretamente a store:
 * const authStore = useAuthStore();
 * const userName = authStore.userName;
 */
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials);
      const redirectTo =
        (router.currentRoute.value.query.redirect as string) || "/chat";
      await router.push(redirectTo);
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await authStore.register(credentials);
      await router.push("/chat");
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      await authStore.forgotPassword(request);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      await authStore.resetPassword(request);
      await router.push("/login");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authStore.logout();
      await router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      await router.push("/login");
    }
  };

  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
      return false;
    }
    return true;
  };

  const requireGuest = () => {
    if (authStore.isAuthenticated) {
      router.push("/chat");
      return false;
    }
    return true;
  };

  const initializeAuth = async () => {
    await authStore.initializeAuth();
  };

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,

    requireAuth,
    requireGuest,

    initializeAuth,
  };
}

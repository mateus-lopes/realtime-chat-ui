import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "@/services/auth.service";
import { isTokenValid } from "@/utils/jwt.utils";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    const hasToken = !!token.value;
    const hasUser = !!user.value;
    const tokenValid = token.value ? isTokenValid(token.value) : false;
    return hasToken && hasUser && tokenValid;
  });

  const userName = computed(() => user.value?.fullName || "");
  const userEmail = computed(() => user.value?.email || "");

  const initializeAuth = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        token.value = storedToken;
        user.value = storedUser;

        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          user.value = currentUser;
        } else {
          await logout();
        }
      }
    } catch (error: any) {
      console.error("Auth initialization error:", error);
      await logout();
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const authResponse = await authService.login(credentials);

      user.value = authResponse.user;
      token.value = authResponse.token;
      refreshToken.value = authResponse.refreshToken;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const authResponse = await authService.register(credentials);

      user.value = authResponse.user;
      token.value = authResponse.token;
      refreshToken.value = authResponse.refreshToken;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      isLoading.value = true;
      error.value = null;
      await authService.forgotPassword(request);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      isLoading.value = true;
      error.value = null;
      await authService.resetPassword(request);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      user.value = null;
      token.value = null;
      refreshToken.value = null;
      error.value = null;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        token.value = newToken;
      } else {
        await logout();
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData };
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const setOnlineStatus = (online: boolean) => {
    if (user.value) {
      user.value.isOnline = online;
    }
  };

  const updateLastSeen = () => {
    if (user.value) {
      user.value.lastSeen = new Date();
    }
  };

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userName,
    userEmail,

    // Actions
    initializeAuth,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    refreshAuthToken,
    updateUser,
    clearError,
    setOnlineStatus,
    updateLastSeen,
  };
});

// Pinia Auth Store for Mobile-First Chat App

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "@/services/auth.service";
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userName = computed(() => user.value?.fullName || "");
  const userEmail = computed(() => user.value?.email || "");
  const userAvatar = computed(() => user.value?.profilePicture || "");
  const isOnline = computed(() => user.value?.isOnline || false);

  // Actions
  const initializeAuth = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      // Check for stored auth data
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        token.value = storedToken;
        user.value = storedUser;

        // Verify token is still valid by fetching current user
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          user.value = currentUser;
        } else {
          // Token is invalid, clear auth data
          await logout();
        }
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
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

      return authResponse;
    } catch (err: any) {
      error.value = err.message || "Login failed";
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

      return authResponse;
    } catch (err: any) {
      error.value = err.message || "Registration failed";
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
      error.value = err.message || "Failed to send reset email";
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
      error.value = err.message || "Failed to reset password";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      isLoading.value = true;
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      user.value = null;
      token.value = null;
      refreshToken.value = null;
      error.value = null;
      isLoading.value = false;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        token.value = newToken;
        return true;
      }
      return false;
    } catch (err) {
      console.error("Token refresh error:", err);
      await logout();
      return false;
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
      // Store the updated user data
      localStorage.setItem("user_data", JSON.stringify(user.value));
    }
  };

  const clearError = () => {
    error.value = null;
  };

  // Mobile-specific actions
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

  // Return store interface
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
    userAvatar,
    isOnline,

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

// Helper function to get auth state for components
export const getAuthState = (): AuthState => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  };
};

// Pinia Auth Store for Mobile-First Chat App

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "@/services/auth.service";
import { getTokenExpiryInfo, isTokenValid } from "@/utils/jwt.utils";
import type {
  User,
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
  const isAuthenticated = computed(() => {
    const hasToken = !!token.value;
    const hasUser = !!user.value;
    const tokenValid = token.value ? isTokenValid(token.value) : false;
    return hasToken && hasUser && tokenValid;
  });

  const userName = computed(() => user.value?.fullName || "");
  const userAbout = computed(() => user.value?.about || "");
  const userEmail = computed(() => user.value?.email || "");
  const userAvatar = computed(() => user.value?.profilePicture || "");
  const isOnline = computed(() => user.value?.isOnline || false);

  // 🔄 Token-related getters
  const tokenExpiryInfo = computed(() => {
    return token.value ? getTokenExpiryInfo(token.value) : "No token";
  });

  const refreshStatus = computed(() => {
    return authService.getRefreshStatus();
  });

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

  const updateUser = async (updatedUser: Partial<User>) => {
    console.log("Updating user:", updatedUser);
    console.log("Current user before update:", user.value);
    try {
      isLoading.value = true;
      error.value = null;

      if (user.value) {
        user.value = { ...user.value, ...updatedUser };
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("user_data", JSON.stringify(user.value));
        }
      }

      await authService.updateProfile(updatedUser);
    } catch (err: any) {
      console.error("Update user error:", err);
      error.value = err.message || "Failed to update user information";
      throw err;
    } finally {
      isLoading.value = false;
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
    userAbout,
    userEmail,
    userAvatar,
    isOnline,
    tokenExpiryInfo,
    refreshStatus,

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

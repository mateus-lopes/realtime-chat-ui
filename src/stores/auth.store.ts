import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authService from "@/services/auth.service";
import { isTokenValid } from "@/utils/jwt.utils";
import type {
  IUser,
  ILoginCredentials,
  IRegisterCredentials,
  IForgotPasswordRequest,
  IResetPasswordRequest,
} from "@/types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<IUser | null>(null);
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
  const userAbout = computed(() => user.value?.about || "");
  const userEmail = computed(() => user.value?.email || "");
  const userAvatar = computed(() => user.value?.profilePicture || "");
  const isOnline = computed(() => user.value?.isOnline || false);

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

  const login = async (credentials: ILoginCredentials) => {
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

  const register = async (credentials: IRegisterCredentials) => {
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

  const forgotPassword = async (request: IForgotPasswordRequest) => {
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

  const resetPassword = async (request: IResetPasswordRequest) => {
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

  const updateUser = async (userData: Partial<IUser>) => {
    try {
      isLoading.value = true;
      error.value = null;

      const updatedUser = await authService.updateProfile(userData);
      user.value = updatedUser;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const setOnlineStatus = async (online: boolean) => {
    if (!user.value) return;

    try {
      await updateUser({ isOnline: online });
    } catch (err: any) {
      console.error("Failed to update online status:", err);
      if (user.value) {
        user.value.isOnline = !online;
      }
    }
  };

  const updateLastSeen = () => {
    if (user.value) {
      user.value.lastSeen = new Date();
    }
  };

  return {
    user,
    token,
    refreshToken,
    isLoading,
    error,

    isAuthenticated,
    userName,
    userAbout,
    userEmail,
    userAvatar,
    isOnline,

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

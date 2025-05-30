// Auth Composable for Mobile-First Chat App

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginCredentials, RegisterCredentials, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth.types';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  // Computed properties
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.error);
  const userName = computed(() => authStore.userName);
  const userEmail = computed(() => authStore.userEmail);
  const userAvatar = computed(() => authStore.userAvatar);
  const isOnline = computed(() => authStore.isOnline);

  // Auth actions
  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials);
      // Redirect to dashboard or intended route after successful login
      const redirectTo = router.currentRoute.value.query.redirect as string || '/dashboard';
      await router.push(redirectTo);
    } catch (error) {
      // Error is already handled in store
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await authStore.register(credentials);
      // Redirect to dashboard after successful registration
      await router.push('/dashboard');
    } catch (error) {
      // Error is already handled in store
      throw error;
    }
  };

  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      await authStore.forgotPassword(request);
      // Could redirect to a success page or show success message
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      await authStore.resetPassword(request);
      // Redirect to login page after successful password reset
      await router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authStore.logout();
      // Redirect to login page after logout
      await router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      await router.push('/login');
    }
  };

  const clearError = () => {
    authStore.clearError();
  };

  // Navigation guards helpers
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      });
      return false;
    }
    return true;
  };

  const requireGuest = () => {
    if (isAuthenticated.value) {
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  // Mobile-specific helpers
  const setOnlineStatus = (online: boolean) => {
    authStore.setOnlineStatus(online);
  };

  const updateLastSeen = () => {
    authStore.updateLastSeen();
  };

  // Initialize auth on app start
  const initializeAuth = async () => {
    await authStore.initializeAuth();
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userName,
    userEmail,
    userAvatar,
    isOnline,

    // Actions
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    clearError,

    // Navigation helpers
    requireAuth,
    requireGuest,

    // Mobile helpers
    setOnlineStatus,
    updateLastSeen,

    // Initialization
    initializeAuth
  };
}

// Authentication Service for Mobile-First Chat App

import apiService from "./api.service";
import apiConfig from "@/config/api.config";
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
  SignupRequest,
  LoginRequest,
  UpdateProfileRequest,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/api.types";

class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly USER_KEY = "user_data";

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token) {
      apiService.setAuthToken(token);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const loginRequest: LoginRequest = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await apiService.post<any>(
        apiConfig.ENDPOINTS.AUTH.LOGIN,
        loginRequest
      );

      // Adapt backend response to frontend format
      const authResponse: AuthResponse = {
        user: response.user || response.data?.user,
        token: response.token || response.data?.token,
        refreshToken:
          response.refreshToken || response.data?.refreshToken || "",
        expiresIn: response.expiresIn || response.data?.expiresIn || 3600,
      };

      await this.handleAuthSuccess(authResponse);
      return authResponse;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const signupRequest: SignupRequest = {
        email: credentials.email,
        fullName: credentials.fullName,
        password: credentials.password,
      };

      const response = await apiService.post<any>(
        apiConfig.ENDPOINTS.AUTH.SIGNUP,
        signupRequest
      );

      // Adapt backend response to frontend format
      const authResponse: AuthResponse = {
        user: response.user || response.data?.user,
        token: response.token || response.data?.token,
        refreshToken:
          response.refreshToken || response.data?.refreshToken || "",
        expiresIn: response.expiresIn || response.data?.expiresIn || 3600,
      };

      await this.handleAuthSuccess(authResponse);
      return authResponse;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    try {
      const response = await apiService.post("/auth/forgot-password", request);

      if (!response.success) {
        throw new Error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    try {
      const response = await apiService.post("/auth/reset-password", request);

      if (!response.success) {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if online
      if (navigator.onLine) {
        await apiService.get(apiConfig.ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      this.clearAuthData();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiService.post<{
        token: string;
        refreshToken: string;
      }>("/auth/refresh", {
        refreshToken,
      });

      if (response.success && response.data) {
        this.storeToken(response.data.token);
        this.storeRefreshToken(response.data.refreshToken);
        apiService.setAuthToken(response.data.token);
        return response.data.token;
      }

      throw new Error("Token refresh failed");
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearAuthData();
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<any>(apiConfig.ENDPOINTS.AUTH.ME);

      const user = response.user || response.data?.user || response;
      if (user) {
        this.storeUser(user);
        return user;
      }

      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  private async handleAuthSuccess(authData: AuthResponse): Promise<void> {
    this.storeToken(authData.token);
    this.storeRefreshToken(authData.refreshToken);
    this.storeUser(authData.user);
    apiService.setAuthToken(authData.token);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    apiService.removeAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Mobile-specific: Check if biometric auth is available
  async isBiometricAvailable(): Promise<boolean> {
    if ("credentials" in navigator && "create" in navigator.credentials) {
      try {
        const available = await (
          navigator.credentials as any
        ).isUserVerifyingPlatformAuthenticatorAvailable();
        return available;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Mobile-specific: Enable biometric login
  async enableBiometricAuth(): Promise<boolean> {
    // Implementation would depend on WebAuthn API
    // This is a placeholder for biometric authentication
    return false;
  }

  // Update user profile
  async updateProfile(updateData: UpdateProfileRequest): Promise<User> {
    try {
      const response = await apiService.put<any>(
        apiConfig.ENDPOINTS.AUTH.UPDATE,
        updateData
      );

      const user = response.user || response.data?.user || response;
      if (user) {
        this.storeUser(user);
        return user;
      }

      throw new Error("Failed to update profile");
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    }
  }
}

export default new AuthService();

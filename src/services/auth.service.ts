// Authentication Service for Mobile-First Chat App

import apiService from "./api.service";
import apiConfig from "@/config/api.config";
import {
  isTokenValid,
  needsRefresh,
  getNextRefreshTime,
  debugToken,
} from "@/utils/jwt.utils";
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
import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenRefreshStatus,
} from "@/types/jwt.types";

class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly USER_KEY = "user_data";

  // 🔄 Token refresh management
  private refreshTimer: NodeJS.Timeout | null = null;
  private refreshStatus: TokenRefreshStatus = {
    state: "idle",
    lastRefresh: null,
    nextRefresh: null,
    retryCount: 0,
    error: null,
  };

  constructor() {
    this.initializeAuth();
    this.setupTokenRefreshCallback();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token) {
      // 🔍 Validate token before using
      if (isTokenValid(token)) {
        apiService.setAuthToken(token);
        this.scheduleTokenRefresh(token);

        if (process.env.NODE_ENV === "development") {
          debugToken(token, "Initialized Auth Token");
        }
      } else {
        console.log("🗑️ Stored token is invalid, clearing...");
        this.clearAuthData();
      }
    }
  }

  /**
   * 📞 Setup callback for API service to handle token refresh
   */
  private setupTokenRefreshCallback(): void {
    apiService.setTokenRefreshCallback(async (currentToken: string | null) => {
      return await this.handleTokenRefresh(currentToken);
    });
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
      const responseData = response.data || response;
      const token = responseData.token || responseData.accessToken;

      console.log("🔧 Login: Received token from backend", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 50)}...` : "null",
        fullResponse: response,
        responseData,
      });

      const authResponse: AuthResponse = {
        user: responseData.user,
        token: token,
        refreshToken: responseData.refreshToken || "",
        expiresIn: responseData.expiresIn || 3600,
      };

      console.log("🔧 Login: About to call handleAuthSuccess", {
        authResponse,
        hasToken: !!authResponse.token,
        hasUser: !!authResponse.user,
      });

      await this.handleAuthSuccess(authResponse);

      console.log("🔧 Login: handleAuthSuccess completed");

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
      const responseData = response.data || response;
      const authResponse: AuthResponse = {
        user: responseData.user,
        token: responseData.token || responseData.accessToken,
        refreshToken: responseData.refreshToken || "",
        expiresIn: responseData.expiresIn || 3600,
      };

      console.log("🔧 Login: About to call handleAuthSuccess", {
        authResponse,
        hasToken: !!authResponse.token,
        hasUser: !!authResponse.user,
      });

      await this.handleAuthSuccess(authResponse);

      console.log("🔧 Login: handleAuthSuccess completed");

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
      // 🔍 First, try to get user from localStorage
      const storedUser = this.getStoredUser();
      const storedToken = this.getStoredToken();

      // If we have both user and valid token, return stored user
      if (storedUser && storedToken && isTokenValid(storedToken)) {
        console.log("📦 Using stored user data");
        return storedUser;
      }

      // 📞 Try to fetch from backend (optional endpoint)
      try {
        const response = await apiService.get<any>(apiConfig.ENDPOINTS.AUTH.ME);
        const responseData = response.data || response;
        const user = responseData.user || responseData;

        if (user) {
          this.storeUser(user);
          console.log("🌐 Fetched user from backend");
          return user;
        }
      } catch (apiError: any) {
        console.warn(
          "⚠️ /me endpoint not available or failed:",
          apiError.message
        );

        // If /me endpoint fails but we have stored user, use it
        if (storedUser && storedToken) {
          console.log("📦 Falling back to stored user data");
          return storedUser;
        }
      }

      return null;
    } catch (error) {
      console.error("Get current user error:", error);

      // 📦 Last resort: try stored user
      const storedUser = this.getStoredUser();
      if (storedUser) {
        console.log("📦 Emergency fallback to stored user");
        return storedUser;
      }

      return null;
    }
  }

  private async handleAuthSuccess(authData: AuthResponse): Promise<void> {
    this.storeToken(authData.token);
    this.storeRefreshToken(authData.refreshToken);
    this.storeUser(authData.user);
    apiService.setAuthToken(authData.token);

    // 🔄 Schedule automatic token refresh
    this.scheduleTokenRefresh(authData.token);

    // 📊 Update refresh status
    this.refreshStatus = {
      state: "success",
      lastRefresh: new Date(),
      nextRefresh: getNextRefreshTime(authData.token),
      retryCount: 0,
      error: null,
    };

    console.log("✅ Auth success, token refresh scheduled");
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

    // 🗑️ Clear refresh timer
    this.clearRefreshTimer();

    // 📊 Reset refresh status
    this.refreshStatus = {
      state: "idle",
      lastRefresh: null,
      nextRefresh: null,
      retryCount: 0,
      error: null,
    };

    console.log("🗑️ Auth data cleared, refresh timer stopped");
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
  async updateProfile(updateData: Partial<User>): Promise<User> {
    try {
      console.log("🔧 UpdateProfile: Starting update", {
        updateData,
        hasStoredToken: !!this.getStoredToken(),
        storedTokenPreview: this.getStoredToken()?.substring(0, 50) + "...",
      });

      const response = await apiService.patch<any>(
        apiConfig.ENDPOINTS.AUTH.UPDATE,
        updateData
      );

      const responseData = response.data || response;
      const user = responseData.user || responseData;
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

  // 🔄 TOKEN REFRESH METHODS

  /**
   * 🔄 Handle token refresh (called by API service)
   */
  private async handleTokenRefresh(
    currentToken: string | null
  ): Promise<string | null> {
    if (!currentToken) return null;

    this.refreshStatus.state = "refreshing";

    try {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log("🔄 Calling refresh token endpoint...");

      // 📞 Call backend refresh endpoint
      const response = await this.callRefreshEndpoint(refreshToken);

      if (response) {
        // ✅ Success: store new tokens
        this.storeToken(response.token);
        if (response.refreshToken) {
          this.storeRefreshToken(response.refreshToken);
        }

        // 🔄 Schedule next refresh
        this.scheduleTokenRefresh(response.token);

        // 📊 Update status
        this.refreshStatus = {
          state: "success",
          lastRefresh: new Date(),
          nextRefresh: getNextRefreshTime(response.token),
          retryCount: 0,
          error: null,
        };

        console.log("✅ Token refresh successful");
        return response.token;
      } else {
        throw new Error("Refresh endpoint returned null");
      }
    } catch (error: any) {
      console.error("❌ Token refresh failed:", error);

      // 📊 Update status
      this.refreshStatus = {
        state: "failed",
        lastRefresh: this.refreshStatus.lastRefresh,
        nextRefresh: null,
        retryCount: this.refreshStatus.retryCount + 1,
        error: error.message,
      };

      // 🚫 If refresh fails, clear auth data (user needs to login)
      this.clearAuthData();
      return null;
    }
  }

  /**
   * 📞 Call the refresh token endpoint
   */
  private async callRefreshEndpoint(
    refreshToken: string
  ): Promise<RefreshTokenResponse | null> {
    try {
      // 🚫 Don't use the regular API service to avoid infinite loops
      const response = await fetch(`${apiService["baseURL"]}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      // 🔄 Adapt response format
      return {
        token: data.token || data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 900, // Default 15 minutes
      };
    } catch (error) {
      console.error("❌ Refresh endpoint call failed:", error);
      throw error;
    }
  }

  /**
   * ⏰ Schedule automatic token refresh
   */
  private scheduleTokenRefresh(token: string): void {
    this.clearRefreshTimer();

    const nextRefreshTime = getNextRefreshTime(token);
    if (!nextRefreshTime) return;

    const now = new Date();
    const delay = nextRefreshTime.getTime() - now.getTime();

    if (delay > 0) {
      console.log(
        `⏰ Token refresh scheduled in ${Math.round(delay / 1000 / 60)} minutes`
      );

      this.refreshTimer = setTimeout(async () => {
        console.log("⏰ Scheduled refresh triggered");
        await this.handleTokenRefresh(token);
      }, delay);

      this.refreshStatus.nextRefresh = nextRefreshTime;
    } else {
      console.log("⚠️ Token expires soon, should refresh immediately");
    }
  }

  /**
   * 🗑️ Clear refresh timer
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * 📊 Get current refresh status (for debugging)
   */
  getRefreshStatus(): TokenRefreshStatus {
    return { ...this.refreshStatus };
  }
}

export default new AuthService();

import apiService from "./api.service";
import apiConfig from "@/config/api.config";
import { isTokenValid } from "@/utils/jwt.utils";
import type {
  ILoginCredentials,
  IRegisterCredentials,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IAuthResponse,
  IUser,
} from "@/types/auth.types";

class AuthService {
  private readonly TOKEN_KEY = "token";
  private readonly REFRESH_TOKEN_KEY = "refreshToken";
  private readonly USER_KEY = "user";

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token && isTokenValid(token)) {
      apiService.setAuthToken(token);
    } else {
      this.clearAuthData();
    }
  }

  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    try {
      const response = await apiService.post<any>(
        apiConfig.ENDPOINTS.AUTH.LOGIN,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      const responseData = response.data || response;
      const authResponse: IAuthResponse = {
        user: responseData.user,
        token: responseData.token || responseData.accessToken,
        refreshToken: responseData.refreshToken || "",
        expiresIn: responseData.expiresIn || 3600,
      };

      this.handleAuthSuccess(authResponse);
      return authResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }

  async register(credentials: IRegisterCredentials): Promise<IAuthResponse> {
    try {
      const response = await apiService.post<any>(
        apiConfig.ENDPOINTS.AUTH.SIGNUP,
        {
          email: credentials.email,
          fullName: credentials.fullName,
          password: credentials.password,
        }
      );

      const responseData = response.data || response;
      const authResponse: IAuthResponse = {
        user: responseData.user,
        token: responseData.token || responseData.accessToken,
        refreshToken: responseData.refreshToken || "",
        expiresIn: responseData.expiresIn || 3600,
      };

      this.handleAuthSuccess(authResponse);
      return authResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }

  async forgotPassword(request: IForgotPasswordRequest): Promise<void> {
    try {
      await apiService.post(apiConfig.ENDPOINTS.AUTH.FORGOT_PASSWORD, request);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send reset email"
      );
    }
  }

  async resetPassword(request: IResetPasswordRequest): Promise<void> {
    try {
      await apiService.post(apiConfig.ENDPOINTS.AUTH.RESET_PASSWORD, request);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    }
  }

  async logout(): Promise<void> {
    try {
      if (navigator.onLine) {
        await apiService.post(apiConfig.ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
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
      }>(apiConfig.ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.data) {
        this.storeToken(response.data.token);
        this.storeRefreshToken(response.data.refreshToken);
        apiService.setAuthToken(response.data.token);
        return response.data.token;
      }

      throw new Error("Token refresh failed");
    } catch (error) {
      this.clearAuthData();
      return null;
    }
  }

  async getCurrentUser(): Promise<IUser | null> {
    try {
      const response = await apiService.get<IUser>(
        apiConfig.ENDPOINTS.AUTH.PROFILE
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(userData: Partial<IUser>): Promise<IUser> {
    try {
      const response = await apiService.patch<IUser>(
        apiConfig.ENDPOINTS.AUTH.UPDATE,
        userData
      );
      const updatedUser = response.data;
      this.storeUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    }
  }

  private handleAuthSuccess(authResponse: IAuthResponse): void {
    this.storeToken(authResponse.token);
    this.storeRefreshToken(authResponse.refreshToken);
    this.storeUser(authResponse.user);
    apiService.setAuthToken(authResponse.token);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    apiService.removeAuthToken();
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getStoredUser(): IUser | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeUser(user: IUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getRefreshStatus() {
    return {
      isRefreshing: false,
      lastRefresh: null,
      nextRefresh: null,
      refreshCount: 0,
    };
  }
}

export default new AuthService();

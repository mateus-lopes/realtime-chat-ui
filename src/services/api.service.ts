// Mobile-First API Service with offline support

import type {
  ApiResponse,
  ApiError,
  RequestConfig,
  NetworkStatus,
  OfflineRequest,
} from "@/types/api.types";
import apiConfig from "@/config/api.config";
import { isTokenValid, needsRefresh, debugToken } from "@/utils/jwt.utils";

class ApiService {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private offlineQueue: OfflineRequest[] = [];
  private authToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null; // 🔄 Prevent multiple refresh calls
  private onTokenRefresh: ((token: string | null) => Promise<void>) | null =
    null; // 📞 Callback for token refresh
  private networkStatus: NetworkStatus = {
    isOnline: navigator.onLine,
    connectionType: "unknown",
    effectiveType: "unknown",
  };

  constructor(baseURL: string = apiConfig.BASE_URL) {
    this.baseURL = baseURL;
    this.setupNetworkListeners();
    this.setupConnectionMonitoring();
  }

  private setupNetworkListeners(): void {
    window.addEventListener("online", () => {
      this.networkStatus.isOnline = true;
      this.processOfflineQueue();
    });

    window.addEventListener("offline", () => {
      this.networkStatus.isOnline = false;
    });
  }

  private setupConnectionMonitoring(): void {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.networkStatus.effectiveType =
          connection.effectiveType || "unknown";
        this.networkStatus.connectionType = connection.type || "unknown";

        connection.addEventListener("change", () => {
          this.networkStatus.effectiveType =
            connection.effectiveType || "unknown";
          this.networkStatus.connectionType = connection.type || "unknown";
        });
      }
    }
  }

  private async processOfflineQueue(): Promise<void> {
    if (!this.networkStatus.isOnline || this.offlineQueue.length === 0) {
      return;
    }

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const request of queue) {
      try {
        await this.request(request.config);
      } catch (error) {
        // Re-queue failed requests with retry limit
        if (request.retryCount < 3) {
          this.offlineQueue.push({
            ...request,
            retryCount: request.retryCount + 1,
          });
        }
      }
    }
  }

  private queueOfflineRequest(config: RequestConfig): void {
    const offlineRequest: OfflineRequest = {
      id: Date.now().toString(),
      config,
      timestamp: Date.now(),
      retryCount: 0,
    };
    this.offlineQueue.push(offlineRequest);
  }

  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // 🔄 JWT Interceptor: Check and refresh token if needed
    await this.handleTokenRefresh();

    // Queue request if offline (for non-GET requests)
    if (!this.networkStatus.isOnline && config.method !== "GET") {
      this.queueOfflineRequest(config);
      throw new ApiError(0, "Offline - request queued", {}, "OFFLINE");
    }

    const url = `${this.baseURL}${config.url}`;
    const timeout = config.timeout || this.defaultTimeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...config.headers,
      };

      // Add authorization header if token is available
      if (this.authToken) {
        // Backend expects just the token, not "Bearer TOKEN"
        headers["authorization"] = this.authToken;

        console.log("🔧 API Request: Adding Authorization header", {
          url: config.url,
          hasToken: !!this.authToken,
          tokenPreview: this.authToken
            ? `${this.authToken.substring(0, 50)}...`
            : "null",
        });
      } else {
        console.log("⚠️ API Request: No auth token available", {
          url: config.url,
          authToken: this.authToken,
        });
      }

      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // 🔄 Handle 401 Unauthorized - try token refresh
        if (response.status === 401 && this.authToken) {
          console.log("🔄 Got 401, attempting token refresh...");

          const newToken = await this.attemptTokenRefresh();
          if (newToken) {
            console.log("✅ Token refreshed, retrying request...");
            // Retry the original request with new token
            return this.request<T>(config);
          } else {
            console.log("❌ Token refresh failed, user needs to login");
            // Token refresh failed, user needs to login again
          }
        }

        throw new ApiError(
          response.status,
          errorData.message || "Request failed",
          errorData.errors,
          errorData.code
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new ApiError(408, "Request timeout", {}, "TIMEOUT");
      }

      throw new ApiError(0, "Network error", {}, "NETWORK_ERROR");
    }
  }

  async get<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request<T>({
      method: "GET",
      url: url + queryString,
    });
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data,
    });
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
    });
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      url,
      data,
    });
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
    });
  }

  setAuthToken(token: string): void {
    this.authToken = token;

    // 🐛 Debug token when setting
    console.log("🔧 API Service: Setting auth token", {
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "null",
      hasToken: !!this.authToken,
    });

    if (process.env.NODE_ENV === "development") {
      debugToken(token, "Setting Auth Token");
    }
  }

  removeAuthToken(): void {
    this.authToken = null;
    console.log("🗑️ Auth token removed");
  }

  /**
   * 📞 Set callback function for token refresh
   * This will be called by AuthService to handle token refresh
   */
  setTokenRefreshCallback(
    callback: (token: string | null) => Promise<void>
  ): void {
    this.onTokenRefresh = callback;
  }

  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  getOfflineQueueSize(): number {
    return this.offlineQueue.length;
  }

  /**
   * 🔄 Handle token refresh before making requests
   * This is called automatically before each request
   */
  private async handleTokenRefresh(): Promise<void> {
    if (!this.authToken) return;

    // 🔍 Check if token needs refresh (expires in < 5 minutes)
    if (needsRefresh(this.authToken)) {
      console.log("⏰ Token expires soon, refreshing...");
      await this.attemptTokenRefresh();
    }
  }

  /**
   * 🔄 Attempt to refresh the token
   * Uses the callback provided by AuthService
   */
  private async attemptTokenRefresh(): Promise<string | null> {
    // 🚫 Prevent multiple simultaneous refresh calls
    if (this.refreshPromise) {
      console.log("⏳ Token refresh already in progress, waiting...");
      return this.refreshPromise;
    }

    // 📞 Call the refresh callback if available
    if (!this.onTokenRefresh) {
      console.warn("⚠️ No token refresh callback set");
      return null;
    }

    try {
      this.refreshPromise = this.onTokenRefresh(this.authToken);
      const newToken = await this.refreshPromise;

      if (newToken) {
        console.log("✅ Token refresh successful");
        this.authToken = newToken;
        return newToken;
      } else {
        console.log("❌ Token refresh returned null");
        return null;
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      return null;
    } finally {
      this.refreshPromise = null;
    }
  }
}

// Custom error class
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export { ApiService, ApiError };
export default new ApiService();

// Mobile-First API Service with offline support

import type {
  ApiResponse,
  ApiError,
  RequestConfig,
  NetworkStatus,
  OfflineRequest,
} from "@/types/api.types";
import apiConfig from "@/config/api.config";

class ApiService {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private offlineQueue: OfflineRequest[] = [];
  private authToken: string | null = null;
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
        headers["Authorization"] = `Bearer ${this.authToken}`;
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

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
    });
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  removeAuthToken(): void {
    this.authToken = null;
  }

  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  getOfflineQueueSize(): number {
    return this.offlineQueue.length;
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

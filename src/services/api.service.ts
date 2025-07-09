import type {
  ApiResponse,
  ApiError,
  RequestConfig,
} from "@/types/api.types";
import apiConfig from "@/config/api.config";

class ApiService {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private authToken: string | null = null;

  constructor(baseURL: string = apiConfig.BASE_URL) {
    this.baseURL = baseURL;
  }

  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${config.url}`;
    const timeout = config.timeout || this.defaultTimeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...config.headers,
      };

      if (this.authToken) {
        headers["Authorization"] = this.authToken;
      }

      const response = await fetch(url, {
        method: config.method || "GET",
        headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || response.statusText,
          errorData,
          "HTTP_ERROR"
        );
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
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
  }

  removeAuthToken(): void {
    this.authToken = null;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data: any = {},
    public type: string = "API_ERROR"
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export default new ApiService();

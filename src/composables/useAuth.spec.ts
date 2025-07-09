import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuth } from "./useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

// Mock dependencies
vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/stores/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

const mockRouter = {
  push: vi.fn(),
  currentRoute: {
    value: {
      query: {},
      fullPath: "/current-path",
    },
  },
};

const mockAuthStore = {
  login: vi.fn(),
  register: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  logout: vi.fn(),
  initializeAuth: vi.fn(),
  isAuthenticated: false,
};

describe("useAuth", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    (useRouter as any).mockReturnValue(mockRouter);
    (useAuthStore as any).mockReturnValue(mockAuthStore);

    mockRouter.push.mockResolvedValue(undefined);
    mockAuthStore.isAuthenticated = false;
  });

  describe("login", () => {
    it("deve fazer login e redirecionar para /chat por padrão", async () => {
      const { login } = useAuth();
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockAuthStore.login.mockResolvedValue(undefined);

      await login(credentials);

      expect(mockAuthStore.login).toHaveBeenCalledWith(credentials);
      expect(mockRouter.push).toHaveBeenCalledWith("/chat");
    });

    it("deve redirecionar para a URL de redirect se fornecida", async () => {
      const { login } = useAuth();
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockRouter.currentRoute.value.query.redirect = "/profile";
      mockAuthStore.login.mockResolvedValue(undefined);

      await login(credentials);

      expect(mockAuthStore.login).toHaveBeenCalledWith(credentials);
      expect(mockRouter.push).toHaveBeenCalledWith("/profile");
    });

    it("deve propagar erro se login falhar", async () => {
      const { login } = useAuth();
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      const error = new Error("Invalid credentials");

      mockAuthStore.login.mockRejectedValue(error);

      await expect(login(credentials)).rejects.toThrow("Invalid credentials");
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("register", () => {
    it("deve registrar usuário e redirecionar para /chat", async () => {
      const { register } = useAuth();
      const credentials: RegisterCredentials = {
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };

      mockAuthStore.register.mockResolvedValue(undefined);

      await register(credentials);

      expect(mockAuthStore.register).toHaveBeenCalledWith(credentials);
      expect(mockRouter.push).toHaveBeenCalledWith("/chat");
    });

    it("deve propagar erro se registro falhar", async () => {
      const { register } = useAuth();
      const credentials: RegisterCredentials = {
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };
      const error = new Error("Email already exists");

      mockAuthStore.register.mockRejectedValue(error);

      await expect(register(credentials)).rejects.toThrow(
        "Email already exists"
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("forgotPassword", () => {
    it("deve chamar forgotPassword da store", async () => {
      const { forgotPassword } = useAuth();
      const request: ForgotPasswordRequest = {
        email: "test@example.com",
      };

      mockAuthStore.forgotPassword.mockResolvedValue(undefined);

      await forgotPassword(request);

      expect(mockAuthStore.forgotPassword).toHaveBeenCalledWith(request);
    });

    it("deve propagar erro se forgotPassword falhar", async () => {
      const { forgotPassword } = useAuth();
      const request: ForgotPasswordRequest = {
        email: "invalid@example.com",
      };
      const error = new Error("User not found");

      mockAuthStore.forgotPassword.mockRejectedValue(error);

      await expect(forgotPassword(request)).rejects.toThrow("User not found");
    });
  });

  describe("resetPassword", () => {
    it("deve resetar senha e redirecionar para /login", async () => {
      const { resetPassword } = useAuth();
      const request: ResetPasswordRequest = {
        token: "reset-token",
        password: "newpassword123",
      };

      mockAuthStore.resetPassword.mockResolvedValue(undefined);

      await resetPassword(request);

      expect(mockAuthStore.resetPassword).toHaveBeenCalledWith(request);
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
    });

    it("deve propagar erro se resetPassword falhar", async () => {
      const { resetPassword } = useAuth();
      const request: ResetPasswordRequest = {
        token: "invalid-token",
        password: "newpassword123",
      };
      const error = new Error("Invalid token");

      mockAuthStore.resetPassword.mockRejectedValue(error);

      await expect(resetPassword(request)).rejects.toThrow("Invalid token");
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("deve fazer logout e redirecionar para /login", async () => {
      const { logout } = useAuth();

      mockAuthStore.logout.mockResolvedValue(undefined);

      await logout();

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
    });

    it("deve redirecionar para /login mesmo se logout falhar", async () => {
      const { logout } = useAuth();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockAuthStore.logout.mockRejectedValue(new Error("Logout failed"));

      await logout();

      expect(mockAuthStore.logout).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Logout error:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("requireAuth", () => {
    it("deve retornar true se usuário estiver autenticado", () => {
      const { requireAuth } = useAuth();
      mockAuthStore.isAuthenticated = true;

      const result = requireAuth();

      expect(result).toBe(true);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("deve redirecionar para /login se usuário não estiver autenticado", () => {
      const { requireAuth } = useAuth();
      mockAuthStore.isAuthenticated = false;

      const result = requireAuth();

      expect(result).toBe(false);
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: "/login",
        query: { redirect: "/current-path" },
      });
    });
  });

  describe("requireGuest", () => {
    it("deve retornar true se usuário não estiver autenticado", () => {
      const { requireGuest } = useAuth();
      mockAuthStore.isAuthenticated = false;

      const result = requireGuest();

      expect(result).toBe(true);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("deve redirecionar para /chat se usuário estiver autenticado", () => {
      const { requireGuest } = useAuth();
      mockAuthStore.isAuthenticated = true;

      const result = requireGuest();

      expect(result).toBe(false);
      expect(mockRouter.push).toHaveBeenCalledWith("/chat");
    });
  });

  describe("initializeAuth", () => {
    it("deve chamar initializeAuth da store", async () => {
      const { initializeAuth } = useAuth();

      mockAuthStore.initializeAuth.mockResolvedValue(undefined);

      await initializeAuth();

      expect(mockAuthStore.initializeAuth).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./auth.store";
import authService from "@/services/auth.service";
import { isTokenValid, getTokenExpiryInfo } from "@/utils/jwt.utils";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth.types";

// Mock dependencies
vi.mock("@/services/auth.service");
vi.mock("@/utils/jwt.utils");

const mockAuthService = authService as any;
const mockIsTokenValid = isTokenValid as any;
const mockGetTokenExpiryInfo = getTokenExpiryInfo as any;

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    // Default mocks
    mockIsTokenValid.mockReturnValue(true);
    mockGetTokenExpiryInfo.mockReturnValue("Valid token");
    mockAuthService.getRefreshStatus.mockReturnValue({
      isRefreshing: false,
      lastRefresh: null,
      nextRefresh: null,
      refreshCount: 0,
    });
  });

  describe("initial state", () => {
    it("deve inicializar com estado padrão", () => {
      const store = useAuthStore();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.refreshToken).toBeNull();
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe("computed properties", () => {
    it("isAuthenticated deve retornar false quando não há token", () => {
      const store = useAuthStore();

      expect(store.isAuthenticated).toBe(false);
    });

    it("isAuthenticated deve retornar true quando há token válido e usuário", () => {
      const store = useAuthStore();
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };

      store.user = mockUser;
      store.token = "valid-token";
      mockIsTokenValid.mockReturnValue(true);

      expect(store.isAuthenticated).toBe(true);
    });

    it("isAuthenticated deve retornar false quando token é inválido", () => {
      const store = useAuthStore();
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };

      store.user = mockUser;
      store.token = "invalid-token";
      mockIsTokenValid.mockReturnValue(false);

      expect(store.isAuthenticated).toBe(false);
    });

    it("userName deve retornar nome do usuário", () => {
      const store = useAuthStore();
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };

      store.user = mockUser;

      expect(store.userName).toBe("Test User");
    });

    it("userName deve retornar string vazia quando não há usuário", () => {
      const store = useAuthStore();

      expect(store.userName).toBe("");
    });

    it("userEmail deve retornar email do usuário", () => {
      const store = useAuthStore();
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };

      store.user = mockUser;

      expect(store.userEmail).toBe("test@example.com");
    });
  });

  describe("initializeAuth", () => {
    it("deve inicializar com token e usuário armazenados", async () => {
      const store = useAuthStore();
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };

      mockAuthService.getStoredToken.mockReturnValue("stored-token");
      mockAuthService.getStoredUser.mockReturnValue(mockUser);
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      await store.initializeAuth();

      expect(store.token).toBe("stored-token");
      expect(store.user).toEqual(mockUser);
      expect(store.isLoading).toBe(false);
    });

    it("deve fazer logout se getCurrentUser falhar", async () => {
      const store = useAuthStore();
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };

      mockAuthService.getStoredToken.mockReturnValue("stored-token");
      mockAuthService.getStoredUser.mockReturnValue(mockUser);
      mockAuthService.getCurrentUser.mockResolvedValue(null);
      mockAuthService.logout.mockResolvedValue();

      await store.initializeAuth();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
    });

    it("deve fazer logout em caso de erro", async () => {
      const store = useAuthStore();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockAuthService.getStoredToken.mockImplementation(() => {
        throw new Error("Storage error");
      });
      mockAuthService.logout.mockResolvedValue();

      await store.initializeAuth();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Auth initialization error:",
        expect.any(Error)
      );
      expect(store.isLoading).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe("login", () => {
    it("deve fazer login com sucesso", async () => {
      const store = useAuthStore();
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };
      const mockAuthResponse = {
        user: {
          id: "1",
          email: "test@example.com",
          fullName: "Test User",
          profilePicture: "",
          about: "",
          isOnline: true,
          lastSeen: new Date(),
        },
        token: "auth-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      await store.login(credentials);

      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
      expect(store.user).toEqual(mockAuthResponse.user);
      expect(store.token).toBe("auth-token");
      expect(store.refreshToken).toBe("refresh-token");
      expect(store.error).toBeNull();
      expect(store.isLoading).toBe(false);
    });

    it("deve definir erro se login falhar", async () => {
      const store = useAuthStore();
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };
      const error = new Error("Invalid credentials");

      mockAuthService.login.mockRejectedValue(error);

      await expect(store.login(credentials)).rejects.toThrow(
        "Invalid credentials"
      );
      expect(store.error).toBe("Invalid credentials");
      expect(store.isLoading).toBe(false);
    });
  });

  describe("register", () => {
    it("deve registrar usuário com sucesso", async () => {
      const store = useAuthStore();
      const credentials: RegisterCredentials = {
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };
      const mockAuthResponse = {
        user: {
          id: "1",
          email: "test@example.com",
          fullName: "Test User",
          profilePicture: "",
          about: "",
          isOnline: true,
          lastSeen: new Date(),
        },
        token: "auth-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
      };

      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      await store.register(credentials);

      expect(mockAuthService.register).toHaveBeenCalledWith(credentials);
      expect(store.user).toEqual(mockAuthResponse.user);
      expect(store.token).toBe("auth-token");
      expect(store.refreshToken).toBe("refresh-token");
      expect(store.error).toBeNull();
    });
  });

  describe("logout", () => {
    it("deve fazer logout e limpar estado", async () => {
      const store = useAuthStore();

      // Set some initial state
      store.user = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: new Date(),
      };
      store.token = "auth-token";
      store.refreshToken = "refresh-token";

      mockAuthService.logout.mockResolvedValue();

      await store.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.refreshToken).toBeNull();
      expect(store.error).toBeNull();
    });
  });

  describe("refreshAuthToken", () => {
    it("deve atualizar token com sucesso", async () => {
      const store = useAuthStore();

      mockAuthService.refreshToken.mockResolvedValue("new-token");

      await store.refreshAuthToken();

      expect(mockAuthService.refreshToken).toHaveBeenCalled();
      expect(store.token).toBe("new-token");
    });

    it("deve fazer logout se refresh falhar", async () => {
      const store = useAuthStore();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockAuthService.refreshToken.mockRejectedValue(
        new Error("Refresh failed")
      );
      mockAuthService.logout.mockResolvedValue();

      await store.refreshAuthToken();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Token refresh failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("utility methods", () => {
    it("clearError deve limpar erro", () => {
      const store = useAuthStore();
      store.error = "Some error";

      store.clearError();

      expect(store.error).toBeNull();
    });

    it("setOnlineStatus deve atualizar status online do usuário", () => {
      const store = useAuthStore();
      store.user = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: false,
        lastSeen: new Date(),
      };

      store.setOnlineStatus(true);

      expect(store.user.isOnline).toBe(true);
    });

    it("updateLastSeen deve atualizar último acesso", () => {
      const store = useAuthStore();
      const oldDate = new Date("2023-01-01");
      store.user = {
        id: "1",
        email: "test@example.com",
        fullName: "Test User",
        profilePicture: "",
        about: "",
        isOnline: true,
        lastSeen: oldDate,
      };

      store.updateLastSeen();

      expect(store.user.lastSeen).not.toEqual(oldDate);
      expect(store.user.lastSeen).toBeInstanceOf(Date);
    });
  });
});

import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth.store';
import authService from '@/services/auth.service';
import type { LoginCredentials, RegisterCredentials, User, AuthResponse } from '@/types/auth.types';

// Mock auth service
jest.mock('@/services/auth.service', () => ({
  default: {
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    getCurrentUser: jest.fn(),
    getStoredToken: jest.fn(),
    getStoredUser: jest.fn()
  }
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    isOnline: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600
  };

  it('initializes with default state', () => {
    const store = useAuthStore();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('handles successful login', async () => {
    const store = useAuthStore();
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    mockAuthService.login.mockResolvedValue(mockAuthResponse);

    await store.login(credentials);

    expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe('mock-token');
    expect(store.refreshToken).toBe('mock-refresh-token');
    expect(store.isAuthenticated).toBe(true);
    expect(store.error).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('handles login error', async () => {
    const store = useAuthStore();
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'wrong-password'
    };

    const errorMessage = 'Invalid credentials';
    mockAuthService.login.mockRejectedValue(new Error(errorMessage));

    await expect(store.login(credentials)).rejects.toThrow(errorMessage);

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.error).toBe(errorMessage);
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
  });

  it('handles successful registration', async () => {
    const store = useAuthStore();
    const credentials: RegisterCredentials = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      acceptTerms: true
    };

    mockAuthService.register.mockResolvedValue(mockAuthResponse);

    await store.register(credentials);

    expect(mockAuthService.register).toHaveBeenCalledWith(credentials);
    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe('mock-token');
    expect(store.isAuthenticated).toBe(true);
  });

  it('handles forgot password', async () => {
    const store = useAuthStore();
    const request = { email: 'test@example.com' };

    mockAuthService.forgotPassword.mockResolvedValue();

    await store.forgotPassword(request);

    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(request);
    expect(store.error).toBeNull();
  });

  it('handles logout', async () => {
    const store = useAuthStore();
    
    // Set initial authenticated state
    store.user = mockUser;
    store.token = 'mock-token';
    store.refreshToken = 'mock-refresh-token';

    mockAuthService.logout.mockResolvedValue();

    await store.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.error).toBeNull();
  });

  it('handles token refresh', async () => {
    const store = useAuthStore();
    const newToken = 'new-mock-token';

    mockAuthService.refreshToken.mockResolvedValue(newToken);

    const result = await store.refreshAuthToken();

    expect(mockAuthService.refreshToken).toHaveBeenCalled();
    expect(store.token).toBe(newToken);
    expect(result).toBe(true);
  });

  it('handles failed token refresh', async () => {
    const store = useAuthStore();

    mockAuthService.refreshToken.mockResolvedValue(null);

    const result = await store.refreshAuthToken();

    expect(result).toBe(false);
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
  });

  it('initializes auth from stored data', async () => {
    const store = useAuthStore();

    mockAuthService.getStoredToken.mockReturnValue('stored-token');
    mockAuthService.getStoredUser.mockReturnValue(mockUser);
    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

    await store.initializeAuth();

    expect(store.token).toBe('stored-token');
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
  });

  it('clears auth data when stored token is invalid', async () => {
    const store = useAuthStore();

    mockAuthService.getStoredToken.mockReturnValue('invalid-token');
    mockAuthService.getStoredUser.mockReturnValue(mockUser);
    mockAuthService.getCurrentUser.mockResolvedValue(null);
    mockAuthService.logout.mockResolvedValue();

    await store.initializeAuth();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('updates user data', () => {
    const store = useAuthStore();
    store.user = mockUser;

    const updates = { name: 'Updated Name' };
    store.updateUser(updates);

    expect(store.user?.name).toBe('Updated Name');
    expect(store.user?.email).toBe(mockUser.email); // Other fields preserved
  });

  it('sets online status', () => {
    const store = useAuthStore();
    store.user = mockUser;

    store.setOnlineStatus(false);

    expect(store.user?.isOnline).toBe(false);
    expect(store.isOnline).toBe(false);
  });

  it('updates last seen', () => {
    const store = useAuthStore();
    store.user = mockUser;

    const beforeUpdate = new Date();
    store.updateLastSeen();
    const afterUpdate = new Date();

    expect(store.user?.lastSeen).toBeDefined();
    expect(store.user?.lastSeen!.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    expect(store.user?.lastSeen!.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
  });

  it('clears error', () => {
    const store = useAuthStore();
    store.error = 'Some error';

    store.clearError();

    expect(store.error).toBeNull();
  });

  it('computes user properties correctly', () => {
    const store = useAuthStore();
    store.user = mockUser;

    expect(store.userName).toBe(mockUser.name);
    expect(store.userEmail).toBe(mockUser.email);
    expect(store.userAvatar).toBe(mockUser.avatar || '');
    expect(store.isOnline).toBe(mockUser.isOnline);
  });

  it('handles loading states correctly', async () => {
    const store = useAuthStore();
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Mock a delayed response
    mockAuthService.login.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockAuthResponse), 100))
    );

    const loginPromise = store.login(credentials);
    
    expect(store.isLoading).toBe(true);
    
    await loginPromise;
    
    expect(store.isLoading).toBe(false);
  });
});

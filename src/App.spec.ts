import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import App from "./App.vue";
import { useAuth } from "@/composables/useAuth";

// Mock the useAuth composable
jest.mock("@/composables/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("App.vue", () => {
  let router: any;

  beforeEach(() => {
    setActivePinia(createPinia());

    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: "/", component: { template: "<div>Home</div>" } }],
    });

    mockUseAuth.mockReturnValue({
      initializeAuth: jest.fn(),
      user: { value: null },
      isAuthenticated: { value: false },
      isLoading: { value: false },
      error: { value: null },
      userName: { value: "" },
      userEmail: { value: "" },
      userAvatar: { value: "" },
      isOnline: { value: false },
      login: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      logout: jest.fn(),
      clearError: jest.fn(),
      requireAuth: jest.fn(),
      requireGuest: jest.fn(),
      setOnlineStatus: jest.fn(),
      updateLastSeen: jest.fn(),
    });
  });

  it("renderiza o app corretamente", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find("#app").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(true);
  });

  it("inicializa a autenticação no mount", () => {
    const mockInitializeAuth = jest.fn();
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      initializeAuth: mockInitializeAuth,
    });

    mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(mockInitializeAuth).toHaveBeenCalled();
  });
});

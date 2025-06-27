import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import LoginForm from "./LoginForm.vue";
import { useAuth } from "@/composables/useAuth";

// Mock the useAuth composable
jest.mock("@/composables/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Mock components
jest.mock("@/components/ui/MobileInput.vue", () => ({
  name: "MobileInput",
  template:
    '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  props: [
    "modelValue",
    "type",
    "label",
    "placeholder",
    "error",
    "disabled",
    "required",
  ],
  emits: ["update:modelValue", "blur"],
}));

jest.mock("@/components/ui/MobileButton.vue", () => ({
  name: "MobileButton",
  template:
    '<button :disabled="disabled || loading" @click="$emit(\'click\')"><slot /></button>',
  props: ["type", "variant", "size", "loading", "disabled", "fullWidth"],
  emits: ["click"],
}));

const mockLogin = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("LoginForm", () => {
  let router: any;

  beforeEach(() => {
    setActivePinia(createPinia());

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/login", component: { template: "<div>Login</div>" } },
        { path: "/register", component: { template: "<div>Register</div>" } },
        {
          path: "/forgot-password",
          component: { template: "<div>Forgot Password</div>" },
        },
      ],
    });

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      logout: jest.fn(),
      requireAuth: jest.fn(),
      requireGuest: jest.fn(),
      initializeAuth: jest.fn(),
    });

    jest.clearAllMocks();
  });

  const createWrapper = () => {
    return mount(LoginForm, {
      global: {
        plugins: [router],
      },
    });
  };

  it("renders login form correctly", () => {
    const wrapper = createWrapper();

    expect(wrapper.find(".login-form").exists()).toBe(true);
    expect(wrapper.find(".form-title").text()).toBe("Entrar");
    expect(wrapper.find(".form-subtitle").text()).toBe(
      "Acesse sua conta para continuar"
    );
  });

  it("renders email and password inputs", () => {
    const wrapper = createWrapper();

    const inputs = wrapper.findAllComponents({ name: "MobileInput" });
    expect(inputs).toHaveLength(2);

    const emailInput = inputs[0];
    const passwordInput = inputs[1];

    expect(emailInput.props("type")).toBe("email");
    expect(emailInput.props("label")).toBe("E-mail");
    expect(emailInput.props("required")).toBe(true);

    expect(passwordInput.props("type")).toBe("password");
    expect(passwordInput.props("label")).toBe("Senha");
    expect(passwordInput.props("required")).toBe(true);
  });

  it("renders remember me checkbox", () => {
    const wrapper = createWrapper();

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);
    expect(wrapper.find(".checkbox-label").text()).toBe("Lembrar de mim");
  });

  it("renders forgot password link", () => {
    const wrapper = createWrapper();

    const forgotLink = wrapper.find(".forgot-password-link");
    expect(forgotLink.exists()).toBe(true);
    expect(forgotLink.text()).toBe("Esqueci minha senha");
    expect(forgotLink.attributes("to")).toBe("/forgot-password");
  });

  it("renders submit button", () => {
    const wrapper = createWrapper();

    const submitButton = wrapper.findComponent({ name: "MobileButton" });
    expect(submitButton.props("type")).toBe("submit");
    expect(submitButton.props("variant")).toBe("primary");
    expect(submitButton.props("size")).toBe("lg");
    expect(submitButton.props("fullWidth")).toBe(true);
    expect(submitButton.text()).toBe("Entrar");
  });

  it("renders social login button", () => {
    const wrapper = createWrapper();

    const buttons = wrapper.findAllComponents({ name: "MobileButton" });
    const socialButton = buttons.find((button) =>
      button.text().includes("Continuar com Google")
    );

    expect(socialButton).toBeDefined();
    expect(socialButton?.props("variant")).toBe("outline");
  });

  it("renders signup link", () => {
    const wrapper = createWrapper();

    const signupLink = wrapper.find(".signup-link");
    expect(signupLink.exists()).toBe(true);
    expect(signupLink.text()).toBe("Criar conta");
    expect(signupLink.attributes("to")).toBe("/register");
  });

  it("updates form values when inputs change", async () => {
    const wrapper = createWrapper();

    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];
    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];

    await emailInput.vm.$emit("update:modelValue", "test@example.com");
    await passwordInput.vm.$emit("update:modelValue", "password123");

    // Check that the form state is updated
    expect(emailInput.props("modelValue")).toBe("test@example.com");
    expect(passwordInput.props("modelValue")).toBe("password123");
  });

  it("handles form submission", async () => {
    const wrapper = createWrapper();

    // Fill form
    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];
    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];

    await emailInput.vm.$emit("update:modelValue", "test@example.com");
    await passwordInput.vm.$emit("update:modelValue", "password123");

    // Submit form
    await wrapper.find("form").trigger("submit.prevent");

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      rememberMe: false,
    });
  });

  it("handles remember me checkbox", async () => {
    const wrapper = createWrapper();

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setChecked(true);

    // Fill other fields and submit
    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];
    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];

    await emailInput.vm.$emit("update:modelValue", "test@example.com");
    await passwordInput.vm.$emit("update:modelValue", "password123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      rememberMe: true,
    });
  });

  it("validates email format", async () => {
    const wrapper = createWrapper();

    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];

    // Set invalid email
    await emailInput.vm.$emit("update:modelValue", "invalid-email");
    await emailInput.vm.$emit("blur");

    // Check if error is displayed
    expect(emailInput.props("error")).toBe("E-mail inválido");
  });

  it("validates required fields", async () => {
    const wrapper = createWrapper();

    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];
    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];

    // Trigger blur on empty fields
    await emailInput.vm.$emit("blur");
    await passwordInput.vm.$emit("blur");

    expect(emailInput.props("error")).toBe("E-mail é obrigatório");
    expect(passwordInput.props("error")).toBe("Senha é obrigatória");
  });

  it("validates password minimum length", async () => {
    const wrapper = createWrapper();

    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];

    await passwordInput.vm.$emit("update:modelValue", "123");
    await passwordInput.vm.$emit("blur");

    expect(passwordInput.props("error")).toBe(
      "Senha deve ter pelo menos 6 caracteres"
    );
  });

  it("disables submit button when form is invalid", async () => {
    const wrapper = createWrapper();

    const submitButton = wrapper.findAllComponents({ name: "MobileButton" })[0];

    // Initially disabled (empty form)
    expect(submitButton.props("disabled")).toBe(true);
  });

  it("enables submit button when form is valid", async () => {
    const wrapper = createWrapper();

    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];
    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];
    const submitButton = wrapper.findAllComponents({ name: "MobileButton" })[0];

    // Fill valid data
    await emailInput.vm.$emit("update:modelValue", "test@example.com");
    await passwordInput.vm.$emit("update:modelValue", "password123");

    expect(submitButton.props("disabled")).toBe(false);
  });

  it("shows loading state during submission", async () => {
    mockUseAuth.mockReturnValue({
      ...mockUseAuth(),
      isLoading: { value: true },
    });

    const wrapper = createWrapper();
    const submitButton = wrapper.findAllComponents({ name: "MobileButton" })[0];

    expect(submitButton.props("loading")).toBe(true);
  });

  it("displays error message when login fails", async () => {
    const errorMessage = "Invalid credentials";
    mockLogin.mockRejectedValue(new Error(errorMessage));

    const wrapper = createWrapper();

    // Fill form and submit
    const emailInput = wrapper.findAllComponents({ name: "MobileInput" })[0];
    const passwordInput = wrapper.findAllComponents({ name: "MobileInput" })[1];

    await emailInput.vm.$emit("update:modelValue", "test@example.com");
    await passwordInput.vm.$emit("update:modelValue", "wrongpassword");

    try {
      await wrapper.find("form").trigger("submit.prevent");
    } catch (error) {
      // Expected to throw
    }

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".error-message").text()).toBe(errorMessage);
  });
});

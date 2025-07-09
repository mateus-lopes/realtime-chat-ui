import { describe, it, expect, beforeEach, vi } from "vitest";
import { useForm } from "./useForm";
import type { ValidationRule } from "@/types/auth.types";

describe("useForm", () => {
  const initialValues = {
    email: "",
    password: "",
    fullName: "",
  };

  const validationRules: Record<string, ValidationRule[]> = {
    email: [
      { type: "required", message: "Email é obrigatório" },
      { type: "email", message: "Email inválido" },
    ],
    password: [
      { type: "required", message: "Senha é obrigatória" },
      {
        type: "minLength",
        value: 6,
        message: "Senha deve ter pelo menos 6 caracteres",
      },
    ],
    fullName: [{ type: "required", message: "Nome é obrigatório" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("deve inicializar o formulário com valores iniciais", () => {
      const { formState } = useForm(initialValues, validationRules);

      expect(formState.email.value).toBe("");
      expect(formState.password.value).toBe("");
      expect(formState.fullName.value).toBe("");
      expect(formState.email.error).toBeNull();
      expect(formState.email.touched).toBe(false);
    });

    it("deve inicializar com regras de validação", () => {
      const { formState } = useForm(initialValues, validationRules);

      expect(formState.email.rules).toEqual(validationRules.email);
      expect(formState.password.rules).toEqual(validationRules.password);
      expect(formState.fullName.rules).toEqual(validationRules.fullName);
    });
  });

  describe("computed properties", () => {
    it("isValid deve retornar true quando não há erros", () => {
      const { isValid, setValue } = useForm(initialValues, validationRules);

      setValue("email", "test@example.com");
      setValue("password", "password123");
      setValue("fullName", "Test User");

      expect(isValid.value).toBe(true);
    });

    it("hasErrors deve retornar true quando há erros", () => {
      const { hasErrors, validateField } = useForm(
        initialValues,
        validationRules
      );

      validateField("email"); // Campo vazio, deve gerar erro

      expect(hasErrors.value).toBe(true);
    });

    it("isDirty deve retornar true quando valores foram alterados", () => {
      const { isDirty, setValue } = useForm(initialValues, validationRules);

      expect(isDirty.value).toBe(false);

      setValue("email", "test@example.com");

      expect(isDirty.value).toBe(true);
    });
  });

  describe("setValue", () => {
    it("deve definir valor do campo", () => {
      const { formState, setValue } = useForm(initialValues, validationRules);

      setValue("email", "test@example.com");

      expect(formState.email.value).toBe("test@example.com");
    });

    it("deve validar campo se já foi tocado", () => {
      const { formState, setValue, setTouched } = useForm(
        initialValues,
        validationRules
      );

      setTouched("email", true);
      setValue("email", "invalid-email");

      expect(formState.email.error).toBeTruthy();
    });

    it("não deve validar campo se não foi tocado", () => {
      const { formState, setValue } = useForm(initialValues, validationRules);

      setValue("email", "invalid-email");

      expect(formState.email.error).toBeNull();
    });
  });

  describe("setTouched", () => {
    it("deve marcar campo como tocado", () => {
      const { formState, setTouched } = useForm(initialValues, validationRules);

      setTouched("email", true);

      expect(formState.email.touched).toBe(true);
    });

    it("deve validar campo quando marcado como tocado", () => {
      const { formState, setTouched } = useForm(initialValues, validationRules);

      setTouched("email", true); // Campo vazio, deve gerar erro

      expect(formState.email.error).toBeTruthy();
    });
  });

  describe("validateField", () => {
    it("deve validar campo obrigatório", () => {
      const { validateField, formState } = useForm(
        initialValues,
        validationRules
      );

      const isValid = validateField("email");

      expect(isValid).toBe(false);
      expect(formState.email.error).toBe("Email é obrigatório");
    });

    it("deve validar formato de email", () => {
      const { validateField, formState, setValue } = useForm(
        initialValues,
        validationRules
      );

      setValue("email", "invalid-email");
      const isValid = validateField("email");

      expect(isValid).toBe(false);
      expect(formState.email.error).toBe("Email inválido");
    });

    it("deve validar comprimento mínimo", () => {
      const { validateField, formState, setValue } = useForm(
        initialValues,
        validationRules
      );

      setValue("password", "123");
      const isValid = validateField("password");

      expect(isValid).toBe(false);
      expect(formState.password.error).toBe(
        "Senha deve ter pelo menos 6 caracteres"
      );
    });

    it("deve retornar true para campo válido", () => {
      const { validateField, formState, setValue } = useForm(
        initialValues,
        validationRules
      );

      setValue("email", "test@example.com");
      const isValid = validateField("email");

      expect(isValid).toBe(true);
      expect(formState.email.error).toBeNull();
    });
  });

  describe("validateForm", () => {
    it("deve validar todos os campos", () => {
      const { validateForm, formState } = useForm(
        initialValues,
        validationRules
      );

      const isValid = validateForm();

      expect(isValid).toBe(false);
      expect(formState.email.error).toBeTruthy();
      expect(formState.password.error).toBeTruthy();
      expect(formState.fullName.error).toBeTruthy();
    });

    it("deve retornar true quando todos os campos são válidos", () => {
      const { validateForm, setValue } = useForm(
        initialValues,
        validationRules
      );

      setValue("email", "test@example.com");
      setValue("password", "password123");
      setValue("fullName", "Test User");

      const isValid = validateForm();

      expect(isValid).toBe(true);
    });
  });

  describe("getValues", () => {
    it("deve retornar valores atuais do formulário", () => {
      const { getValues, setValue } = useForm(initialValues, validationRules);

      setValue("email", "test@example.com");
      setValue("password", "password123");
      setValue("fullName", "Test User");

      const values = getValues();

      expect(values).toEqual({
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      });
    });
  });

  describe("handleSubmit", () => {
    it("deve chamar onSubmit quando formulário é válido", async () => {
      const { handleSubmit, setValue } = useForm(
        initialValues,
        validationRules
      );
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      setValue("email", "test@example.com");
      setValue("password", "password123");
      setValue("fullName", "Test User");

      await handleSubmit(onSubmit);

      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      });
    });

    it("não deve chamar onSubmit quando formulário é inválido", async () => {
      const { handleSubmit } = useForm(initialValues, validationRules);
      const onSubmit = vi.fn();

      await handleSubmit(onSubmit);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("deve marcar todos os campos como tocados", async () => {
      const { handleSubmit, formState } = useForm(
        initialValues,
        validationRules
      );
      const onSubmit = vi.fn();

      await handleSubmit(onSubmit);

      expect(formState.email.touched).toBe(true);
      expect(formState.password.touched).toBe(true);
      expect(formState.fullName.touched).toBe(true);
    });

    it("deve definir isSubmitting durante submissão", async () => {
      const { handleSubmit, setValue, isSubmitting } = useForm(
        initialValues,
        validationRules
      );
      let submittingDuringExecution = false;

      setValue("email", "test@example.com");
      setValue("password", "password123");
      setValue("fullName", "Test User");

      const onSubmit = vi.fn().mockImplementation(async () => {
        submittingDuringExecution = isSubmitting.value;
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      await handleSubmit(onSubmit);

      expect(submittingDuringExecution).toBe(true);
      expect(isSubmitting.value).toBe(false);
    });

    it("deve capturar e definir erro de submissão", async () => {
      const { handleSubmit, setValue, submitError } = useForm(
        initialValues,
        validationRules
      );
      const error = new Error("Submission failed");

      setValue("email", "test@example.com");
      setValue("password", "password123");
      setValue("fullName", "Test User");

      const onSubmit = vi.fn().mockRejectedValue(error);

      await expect(handleSubmit(onSubmit)).rejects.toThrow("Submission failed");
      expect(submitError.value).toBe("Submission failed");
    });
  });

  describe("mobile helpers", () => {
    it("handleInput deve definir valor do campo", () => {
      const { handleInput, formState } = useForm(
        initialValues,
        validationRules
      );

      const mockEvent = {
        target: { value: "test@example.com" },
      } as any;

      const inputHandler = handleInput("email");
      inputHandler(mockEvent);

      expect(formState.email.value).toBe("test@example.com");
    });

    it("handleBlur deve marcar campo como tocado", () => {
      const { handleBlur, formState } = useForm(initialValues, validationRules);

      const blurHandler = handleBlur("email");
      blurHandler();

      expect(formState.email.touched).toBe(true);
    });
  });

  describe("resetForm", () => {
    it("deve resetar formulário para valores iniciais", () => {
      const { resetForm, setValue, formState } = useForm(
        initialValues,
        validationRules
      );

      setValue("email", "test@example.com");
      setValue("password", "password123");

      resetForm();

      expect(formState.email.value).toBe("");
      expect(formState.password.value).toBe("");
      expect(formState.email.touched).toBe(false);
      expect(formState.email.error).toBeNull();
    });
  });
});

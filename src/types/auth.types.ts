export interface User {
  id: string;
  email: string;
  fullName: string;
  about?: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern";
  value?: number | RegExp;
  message: string;
}

export interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
  rules: ValidationRule[];
}

export interface FormState {
  [key: string]: FormField;
}

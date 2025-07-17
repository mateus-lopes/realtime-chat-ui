export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  about?: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface ILoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern";
  value?: number | RegExp;
  message: string;
}

export interface IFormField {
  value: string;
  error: string | null;
  touched: boolean;
  rules: IValidationRule[];
}

export interface IFormState {
  [key: string]: IFormField;
}

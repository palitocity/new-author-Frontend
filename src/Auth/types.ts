export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Message {
  type: "success" | "error" | "info" | "";
  text: string;
}

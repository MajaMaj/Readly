import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8000/api";

export interface RegisterData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginData {
  identifier: string;
  password?: string;
}

export interface ApiError {
  detail: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ApiError>;
        throw new Error(
          serverError.response?.data?.detail || "Registration failed"
        );
      }
      throw new Error("An unexpected error occurred");
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ApiError>;
        throw new Error(serverError.response?.data?.detail || "Login failed");
      }
      throw new Error("An unexpected error occurred");
    }
  },
};

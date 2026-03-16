import axios from "axios";

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
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.detail || "Something went wrong");
      }
      throw new Error("Network error");
    }
  },

  resetPasswordConfirm: async (token: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/reset-password-confirm`,
      { password },
      { params: { token } }
    );
    return response.data;
  },
};

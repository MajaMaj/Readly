import axios from "axios";

const API_URL = "http://localhost:8000/api/users";

export const userService = {
  getMe: async () => {
    // 1. Pobieramy aktualne dane z sesji bezpośrednio przed strzałem
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) throw new Error("No user in session");

    const user = JSON.parse(storedUser);
    const token = user.access_token || user.token;

    // 2. Wysyłamy zapytanie, podając token ręcznie w nagłówku
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateProfile: async (data: { description?: string; password?: string }) => {
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.access_token || user?.token;

    const response = await axios.put(`${API_URL}/me`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.access_token || user?.token;

    const response = await axios.post(`${API_URL}/me/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

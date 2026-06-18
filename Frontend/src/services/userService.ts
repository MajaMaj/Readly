import axios from "axios";

const API_URL = "http://localhost:8000/api/users";

export const userService = {
  getMe: async () => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) throw new Error("No user in session");

    const user = JSON.parse(storedUser);
    const token = user.access_token || user.token || user.accessToken;

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
    const token = user?.access_token || user?.token || user?.accessToken;

    const response = await axios.put(`${API_URL}/update-profile`, data, {
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
    const token = user?.access_token || user?.token || user?.accessToken;

    const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getUserProfile: async (username: string) => {
    const response = await axios.get(`${API_URL}/profile/${username}`);
    return response.data;
  },
};

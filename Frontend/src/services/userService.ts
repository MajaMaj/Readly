const BASE_URL = "http://localhost:8000";
const API_URL = `${BASE_URL}/api/users`;

export const userService = {
  getMe: async () => {
    const res = await fetch(`${API_URL}/me`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/upload-avatar`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload avatar");
    return res.json();
  },

  updateProfile: async (data: { description?: string; password?: string }) => {
    const res = await fetch(`${API_URL}/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: data.description,
        new_password: data.password,
      }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};

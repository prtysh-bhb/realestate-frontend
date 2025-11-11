/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";

// ✅ Fetch agent profile
export const getProfile = () => api.get("/profile");

// ✅ Update agent profile
export const updateProfile = (data: any) => api.put("/profile", data);

// ✅ Change password
export const changePassword = (data: any) => api.put("/profile/password", data);

// ✅ Upload avatar (multipart)
export const uploadAvatar = (formData: FormData) =>
  api.post("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ✅ Delete avatar
export const deleteAvatar = () => api.delete("/profile/avatar");

// ✅ Delete account
export const deleteAccount = (data: any) =>
  api.delete("/profile/account", { data } as any);

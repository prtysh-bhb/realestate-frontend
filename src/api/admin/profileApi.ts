/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/profileApi.ts
import api  from "@/api/axios";

/** Get current user profile */
export const getProfile = () => api.get("/profile");

/** Update user profile */
export const updateProfile = (data: any) => api.put("/profile", data);

/** Change password (requires confirmed field in form) */
export const changePassword = (data: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => api.put("/profile/password", data);

/** Upload avatar */
export const uploadAvatar = (formData: FormData) =>
  api.post("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Delete avatar */
export const deleteAvatar = () => api.delete("/profile/avatar");

/** Delete account */
export const deleteAccount = (data: { password: string; confirmation: string }) =>
  api.request({ method: "delete", url: "/profile/account", data });

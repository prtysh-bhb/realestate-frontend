/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";


export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  requires_2fa?: boolean;
  user_id?: number;
  data?: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}


export interface Verify2FAResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface TwoFactorSetupResponse {
  success: boolean;
  message?: string;
  data?: {
    secret?: string;
    qr_code_url?: string; // From backend
  };
}



// 🔹 Login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/login", { email, password });
  return res.data;
};


export const verifyTwoFactorLogin = async (
  user_id: number,
  code: string
): Promise<Verify2FAResponse> => {
  const res = await api.post<Verify2FAResponse>("/verify-login", { user_id, code });
  return res.data;
};


export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/register", {
    name,
    email,
    password,
    password_confirmation: password,
    role,
  });
  return res.data;
};


export const forgotPassword = async (email: string): Promise<any> => {
  const res = await api.post("/forgot-password", { email });
  return res.data;
};


export const getCurrentUser = async (): Promise<any> => {
  const res = await api.get("/user");
  return res.data;
};

export const getProfile = async (): Promise<any> => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfile = async (formData: ProfileFormData): Promise<any> => {
  try{
    const res = await api.put("/profile", formData);
    return res.data;
  }catch(error: unknown){
    const axiosError = error as any;
    return {
      success: false,
      message:
        axiosError.response?.data?.message || "Failed to update profile. Please try again.",
    };
  }
};

export const updateAvatar = async (avatar: string | File | null): Promise<any> => {
  try{
    const res = await api.post("/profile/avatar", { avatar }, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return res.data;
  }catch(error: unknown){
    const axiosError = error as any;
    return {
      success: false,
      message:
        axiosError.response?.data?.message || "Failed to update profile. Please try again.",
    };
  }
};

export const logout = async (): Promise<any> => {
  const res = await api.post("/logout");
  return res.data;
};

/* ---------------------- 2FA SETUP ---------------------- */

// Step 1: Request New QR Code for Setup
export const requestTwoFactorNewCode = async (): Promise<TwoFactorSetupResponse> => {
  const res = await api.post<TwoFactorSetupResponse>("/2fa/setup");
  return res.data;
};

// Step 2: Enable 2FA
export const enableTwoFactor = async (
  code: string
): Promise<{ success: boolean; message?: string }> => {
  const res = await api.post<{ success: boolean; message?: string }>("/2fa/enable", { code });
  return res.data;
};

// Step 3: Disable 2FA (optional)
export const disableTwoFactor = async (
  code: string
): Promise<{ success: boolean; message?: string }> => {
  const res = await api.post<{ success: boolean; message?: string }>("/2fa/disable", { code });
  return res.data;
};

// Step 4: Verify 2FA Code during login
export const verifyTwoFactor = async (
  code: string
): Promise<{ success: boolean; message?: string }> => {
  const res = await api.post<{ success: boolean; message?: string }>("/2fa/verify", { code });
  return res.data;
};

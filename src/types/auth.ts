export interface VerifyLogin2FAResponse {
  success: boolean;
  message?: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export interface Generate2FAResponse {
  success: boolean;
  qr_image_base64?: string;
  otpauth_url?: string;
  message?: string;
}

export interface Enable2FAResponse {
  success: boolean;
  message?: string;
  backup_codes?: string[];
}


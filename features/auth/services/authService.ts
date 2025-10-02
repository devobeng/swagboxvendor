import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../config/api";
import {
  LoginCredentials,
  VendorRegistrationData,
  AuthResponse,
  DocumentUploadData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  Vendor,
} from "../types";

export class AuthService {
  // Vendor registration
  static async registerVendor(
    data: VendorRegistrationData,
    documents: {
      ghanaCard: any;
      businessCertificate?: any;
    }
  ): Promise<AuthResponse> {
    const formData = new FormData();

    // Add text data
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.phone) {
      formData.append("phone", data.phone);
    }
    formData.append("businessProfile", JSON.stringify(data.businessProfile));

    // Add documents
    if (documents.ghanaCard) {
      formData.append("ghanaCard", documents.ghanaCard);
    }
    if (documents.businessCertificate) {
      formData.append("businessCertificate", documents.businessCertificate);
    }

    const response = await api.post(
      API_ENDPOINTS.AUTH.REGISTER_VENDOR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  // Vendor login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  // Google OAuth
  static async googleAuth(token: string): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
      token,
      role: "vendor",
    });
    return response.data;
  }

  // Get current vendor profile
  static async getProfile(): Promise<{
    success: boolean;
    data: Vendor;
    message: string;
  }> {
    const response = await api.get(API_ENDPOINTS.VENDOR.PROFILE);
    return response.data;
  }

  // Forgot password
  static async forgotPassword(
    data: ForgotPasswordData
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  }

  // Reset password
  static async resetPassword(
    data: ResetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token: data.token,
      newPassword: data.newPassword,
    });
    return response.data;
  }

  // Change password
  static async changePassword(
    data: ChangePasswordData
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, we should logout locally
      console.log("Logout error:", error);
    }
  }

  // Verify email
  static async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response.data;
  }

  // Resend verification email
  static async resendVerificationEmail(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post(
      `${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/resend`
    );
    return response.data;
  }
}

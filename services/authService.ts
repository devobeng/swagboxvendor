import api from "./api";
import { API_ENDPOINTS } from "../config/api";
import { Vendor } from "../store/authStore";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VendorRegistrationData {
  name: string;
  email: string;
  password: string;
  businessProfile: {
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    taxId?: string;
    bankAccount?: string;
  };
}

export interface BusinessProfile {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  taxId?: string;
  bankAccount?: string;
  businessDescription?: string;
  businessCategory?: string;
}

export class AuthService {
  // Vendor registration
  static async registerVendor(
    data: VendorRegistrationData,
    documents: {
      ghanaCard: any;
      businessCertificate?: any;
    }
  ): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();

    // Add text data
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
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
  static async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  // Google OAuth
  static async googleAuth(
    token: string
  ): Promise<{ success: boolean; data: any; message: string }> {
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

  // Update vendor profile
  static async updateProfile(
    updates: Partial<BusinessProfile>
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(
      API_ENDPOINTS.VENDOR.UPDATE_PROFILE,
      updates
    );
    return response.data;
  }

  // Upload additional documents
  static async uploadDocuments(documents: {
    ghanaCard?: any;
    businessCertificate?: any;
    businessLogo?: any;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();

    Object.entries(documents).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file as any);
      }
    });

    const response = await api.patch(
      API_ENDPOINTS.VENDOR.UPLOAD_DOCUMENTS,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  // Get verification status
  static async getVerificationStatus(): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    const response = await api.get(API_ENDPOINTS.VENDOR.VERIFICATION_STATUS);
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

  // Forgot password
  static async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  }

  // Reset password
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response.data;
  }

  // Change password
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  }
}

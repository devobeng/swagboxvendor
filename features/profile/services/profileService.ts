import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../config/api";
import {
  VendorProfile,
  ProfileUpdateData,
  StoreSettingsUpdateData,
  DocumentUploadData,
  VerificationStatus,
} from "../types";

export class ProfileService {
  // Get vendor profile
  static async getProfile(): Promise<{
    success: boolean;
    data: VendorProfile;
    message: string;
  }> {
    const response = await api.get(API_ENDPOINTS.VENDOR.PROFILE);
    return response.data;
  }

  // Update vendor profile
  static async updateProfile(
    updates: ProfileUpdateData
  ): Promise<{ success: boolean; data: VendorProfile; message: string }> {
    const response = await api.patch(
      API_ENDPOINTS.VENDOR.UPDATE_PROFILE,
      updates
    );
    return response.data;
  }

  // Update store settings
  static async updateStoreSettings(
    settings: StoreSettingsUpdateData
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.UPDATE_PROFILE}/store-settings`,
      settings
    );
    return response.data;
  }

  // Upload profile picture
  static async uploadProfilePicture(
    image: any
  ): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();
    formData.append("profilePicture", image);

    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.UPDATE_PROFILE}/profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Upload store logo
  static async uploadStoreLogo(
    image: any
  ): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();
    formData.append("storeLogo", image);

    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.UPDATE_PROFILE}/store-logo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Upload store banner
  static async uploadStoreBanner(
    image: any
  ): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();
    formData.append("storeBanner", image);

    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.UPDATE_PROFILE}/store-banner`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Upload business documents
  static async uploadDocuments(
    documents: DocumentUploadData
  ): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();

    Object.entries(documents).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
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
    data: VerificationStatus;
    message: string;
  }> {
    const response = await api.get(API_ENDPOINTS.VENDOR.VERIFICATION_STATUS);
    return response.data;
  }

  // Request verification review
  static async requestVerificationReview(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post(
      `${API_ENDPOINTS.VENDOR.VERIFICATION_STATUS}/request-review`
    );
    return response.data;
  }

  // Update business profile
  static async updateBusinessProfile(
    businessProfile: Partial<any>
  ): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.UPDATE_PROFILE}/business-profile`,
      { businessProfile }
    );
    return response.data;
  }

  // Delete account
  static async deleteAccount(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(API_ENDPOINTS.VENDOR.PROFILE);
    return response.data;
  }

  // Deactivate account
  static async deactivateAccount(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.PROFILE}/deactivate`
    );
    return response.data;
  }

  // Reactivate account
  static async reactivateAccount(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.patch(
      `${API_ENDPOINTS.VENDOR.PROFILE}/reactivate`
    );
    return response.data;
  }
}

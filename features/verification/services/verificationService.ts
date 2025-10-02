import api from "../../../services/api";
import { API_ENDPOINTS } from "../../../config/api";
import { VerificationStatus, DocumentUploadRequest } from "../types";

export class VerificationService {
  // Get verification status
  static async getVerificationStatus(): Promise<{
    success: boolean;
    data: VerificationStatus;
    message: string;
  }> {
    const response = await api.get(API_ENDPOINTS.VENDOR.VERIFICATION_STATUS);
    return response.data;
  }

  // Upload verification documents
  static async uploadDocuments(
    documents: DocumentUploadRequest
  ): Promise<{ success: boolean; data: any; message: string }> {
    const formData = new FormData();

    if (documents.ghanaCard) {
      formData.append("ghanaCard", documents.ghanaCard);
    }
    if (documents.businessCertificate) {
      formData.append("businessCertificate", documents.businessCertificate);
    }

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

  // Submit for verification review
  static async submitForReview(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post(
      `${API_ENDPOINTS.VENDOR.VERIFICATION_STATUS}/submit-review`
    );
    return response.data;
  }

  // Request re-verification (after rejection)
  static async requestReVerification(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post(
      `${API_ENDPOINTS.VENDOR.VERIFICATION_STATUS}/re-verify`
    );
    return response.data;
  }

  // Get verification requirements
  static async getVerificationRequirements(): Promise<{
    success: boolean;
    data: any;
    message: string;
  }> {
    const response = await api.get(
      `${API_ENDPOINTS.VENDOR.VERIFICATION_STATUS}/requirements`
    );
    return response.data;
  }

  // Check email verification status
  static async checkEmailVerification(): Promise<{
    success: boolean;
    data: { emailVerified: boolean };
    message: string;
  }> {
    const response = await api.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/status`);
    return response.data;
  }

  // Resend email verification
  static async resendEmailVerification(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post(
      `${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/resend`
    );
    return response.data;
  }
}

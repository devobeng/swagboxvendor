export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VendorRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  businessProfile: BusinessProfile;
}

export interface BusinessProfile {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessCategory: string;
  businessDescription?: string;
  taxId?: string;
  bankAccount?: string;
}

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "vendor";
  businessVerified: boolean;
  emailVerified: boolean;
  isActive: boolean;
  profilePicture?: string;
  ghanaCard?: string;
  businessCertificate?: string;
  businessProfile?: BusinessProfile;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    businessVerified: boolean;
    emailVerified: boolean;
    token: string;
  };
  message: string;
}

export interface DocumentUploadData {
  ghanaCard?: any;
  businessCertificate?: any;
  businessLogo?: any;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

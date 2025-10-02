export interface VendorProfile {
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

export interface BusinessProfile {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessCategory: string;
  businessDescription?: string;
  taxId?: string;
  bankAccount?: string;
}

export interface StoreSettings {
  storeName: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  storeLocation?: {
    address: string;
    city: string;
    region: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contactDetails: {
    email: string;
    phone: string;
    whatsapp?: string;
    website?: string;
  };
  businessHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  businessProfile?: Partial<BusinessProfile>;
}

export interface StoreSettingsUpdateData extends Partial<StoreSettings> {}

export interface DocumentUploadData {
  profilePicture?: any;
  ghanaCard?: any;
  businessCertificate?: any;
  storeLogo?: any;
  storeBanner?: any;
}

export interface VerificationStatus {
  businessVerified: boolean;
  emailVerified: boolean;
  documentsSubmitted: boolean;
  verificationStage: "pending" | "under_review" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

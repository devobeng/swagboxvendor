export interface VerificationStatus {
  businessVerified: boolean;
  emailVerified: boolean;
  documentsSubmitted: boolean;
  verificationStage: "pending" | "under_review" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  requiredDocuments: {
    ghanaCard: {
      uploaded: boolean;
      url?: string;
      status: "pending" | "approved" | "rejected";
      rejectionReason?: string;
    };
    businessCertificate: {
      uploaded: boolean;
      url?: string;
      status: "pending" | "approved" | "rejected";
      rejectionReason?: string;
      required: boolean;
    };
  };
}

export interface DocumentUploadRequest {
  ghanaCard?: any;
  businessCertificate?: any;
}

export interface VerificationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  action?: () => void;
}

export interface DocumentRequirement {
  type: "ghanaCard" | "businessCertificate";
  title: string;
  description: string;
  required: boolean;
  formats: string[];
  maxSize: string;
  examples?: string[];
}

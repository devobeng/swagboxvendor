import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { VerificationService } from "../services/verificationService";
import { useAuthStore } from "../../../store/authStore";
import { DocumentUploadRequest } from "../types";

export const useVerification = () => {
  const { vendor } = useAuthStore();
  const queryClient = useQueryClient();

  // Verification status query
  const verificationQuery = useQuery({
    queryKey: ["verification-status"],
    queryFn: VerificationService.getVerificationStatus,
    enabled: !!vendor,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Verification requirements query
  const requirementsQuery = useQuery({
    queryKey: ["verification-requirements"],
    queryFn: VerificationService.getVerificationRequirements,
    enabled: !!vendor,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Email verification status query
  const emailVerificationQuery = useQuery({
    queryKey: ["email-verification-status"],
    queryFn: VerificationService.checkEmailVerification,
    enabled: !!vendor,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Upload documents mutation
  const uploadDocumentsMutation = useMutation({
    mutationFn: VerificationService.uploadDocuments,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Documents uploaded successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Upload Failed",
        error.response?.data?.message || "Failed to upload documents"
      );
    },
  });

  // Submit for review mutation
  const submitForReviewMutation = useMutation({
    mutationFn: VerificationService.submitForReview,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Submission Failed",
        error.response?.data?.message || "Failed to submit for review"
      );
    },
  });

  // Request re-verification mutation
  const requestReVerificationMutation = useMutation({
    mutationFn: VerificationService.requestReVerification,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Request Failed",
        error.response?.data?.message || "Failed to request re-verification"
      );
    },
  });

  // Resend email verification mutation
  const resendEmailVerificationMutation = useMutation({
    mutationFn: VerificationService.resendEmailVerification,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["email-verification-status"],
        });
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Failed",
        error.response?.data?.message || "Failed to resend verification email"
      );
    },
  });

  return {
    // Data
    verificationStatus: verificationQuery.data?.data,
    requirements: requirementsQuery.data?.data,
    emailVerificationStatus: emailVerificationQuery.data?.data,

    // Loading states
    isVerificationLoading: verificationQuery.isLoading,
    isRequirementsLoading: requirementsQuery.isLoading,
    isEmailVerificationLoading: emailVerificationQuery.isLoading,
    isUploadingDocuments: uploadDocumentsMutation.isPending,
    isSubmittingForReview: submitForReviewMutation.isPending,
    isRequestingReVerification: requestReVerificationMutation.isPending,
    isResendingEmailVerification: resendEmailVerificationMutation.isPending,

    // Errors
    verificationError: verificationQuery.error,
    requirementsError: requirementsQuery.error,
    emailVerificationError: emailVerificationQuery.error,

    // Actions
    uploadDocuments: uploadDocumentsMutation.mutate,
    submitForReview: submitForReviewMutation.mutate,
    requestReVerification: requestReVerificationMutation.mutate,
    resendEmailVerification: resendEmailVerificationMutation.mutate,

    // Refetch functions
    refetchVerification: verificationQuery.refetch,
    refetchRequirements: requirementsQuery.refetch,
    refetchEmailVerification: emailVerificationQuery.refetch,

    // Computed values
    isVerified:
      verificationQuery.data?.data?.businessVerified &&
      emailVerificationQuery.data?.data?.emailVerified,
    canSubmitForReview:
      verificationQuery.data?.data?.documentsSubmitted &&
      !verificationQuery.data?.data?.businessVerified &&
      verificationQuery.data?.data?.verificationStage !== "under_review",
    needsDocuments: !verificationQuery.data?.data?.documentsSubmitted,
    isUnderReview:
      verificationQuery.data?.data?.verificationStage === "under_review",
    isRejected: verificationQuery.data?.data?.verificationStage === "rejected",
  };
};

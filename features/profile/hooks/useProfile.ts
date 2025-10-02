import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ProfileService } from "../services/profileService";
import { useAuthStore } from "../../../store/authStore";
import {
  ProfileUpdateData,
  StoreSettingsUpdateData,
  DocumentUploadData,
} from "../types";

export const useProfile = () => {
  const { vendor, updateVendor } = useAuthStore();
  const queryClient = useQueryClient();

  // Profile query
  const profileQuery = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: ProfileService.getProfile,
    enabled: !!vendor,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Verification status query
  const verificationQuery = useQuery({
    queryKey: ["verification-status"],
    queryFn: ProfileService.getVerificationStatus,
    enabled: !!vendor,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
    onSuccess: (response) => {
      if (response.success) {
        updateVendor(response.data);
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  // Update store settings mutation
  const updateStoreSettingsMutation = useMutation({
    mutationFn: ProfileService.updateStoreSettings,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Store settings updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update store settings"
      );
    },
  });

  // Upload profile picture mutation
  const uploadProfilePictureMutation = useMutation({
    mutationFn: ProfileService.uploadProfilePicture,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Profile picture updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload profile picture"
      );
    },
  });

  // Upload store logo mutation
  const uploadStoreLogoMutation = useMutation({
    mutationFn: ProfileService.uploadStoreLogo,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Store logo updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload store logo"
      );
    },
  });

  // Upload store banner mutation
  const uploadStoreBannerMutation = useMutation({
    mutationFn: ProfileService.uploadStoreBanner,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Store banner updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload store banner"
      );
    },
  });

  // Upload documents mutation
  const uploadDocumentsMutation = useMutation({
    mutationFn: ProfileService.uploadDocuments,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        Alert.alert("Success", "Documents uploaded successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload documents"
      );
    },
  });

  // Update business profile mutation
  const updateBusinessProfileMutation = useMutation({
    mutationFn: ProfileService.updateBusinessProfile,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        Alert.alert("Success", "Business profile updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update business profile"
      );
    },
  });

  // Request verification review mutation
  const requestVerificationMutation = useMutation({
    mutationFn: ProfileService.requestVerificationReview,
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
        "Error",
        error.response?.data?.message || "Failed to request verification"
      );
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: ProfileService.deleteAccount,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert("Success", response.message);
        // Handle logout and navigation
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete account"
      );
    },
  });

  return {
    // Data
    profile: profileQuery.data?.data,
    verificationStatus: verificationQuery.data?.data,

    // Loading states
    isProfileLoading: profileQuery.isLoading,
    isVerificationLoading: verificationQuery.isLoading,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingStoreSettings: updateStoreSettingsMutation.isPending,
    isUploadingProfilePicture: uploadProfilePictureMutation.isPending,
    isUploadingStoreLogo: uploadStoreLogoMutation.isPending,
    isUploadingStoreBanner: uploadStoreBannerMutation.isPending,
    isUploadingDocuments: uploadDocumentsMutation.isPending,
    isUpdatingBusinessProfile: updateBusinessProfileMutation.isPending,
    isRequestingVerification: requestVerificationMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,

    // Errors
    profileError: profileQuery.error,
    verificationError: verificationQuery.error,

    // Actions
    updateProfile: updateProfileMutation.mutate,
    updateStoreSettings: updateStoreSettingsMutation.mutate,
    uploadProfilePicture: uploadProfilePictureMutation.mutate,
    uploadStoreLogo: uploadStoreLogoMutation.mutate,
    uploadStoreBanner: uploadStoreBannerMutation.mutate,
    uploadDocuments: uploadDocumentsMutation.mutate,
    updateBusinessProfile: updateBusinessProfileMutation.mutate,
    requestVerification: requestVerificationMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,

    // Refetch functions
    refetchProfile: profileQuery.refetch,
    refetchVerification: verificationQuery.refetch,
  };
};

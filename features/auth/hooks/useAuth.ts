import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthService } from "../services/authService";
import { useAuthStore } from "../../../store/authStore";
import {
  LoginCredentials,
  VendorRegistrationData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from "../types";

export const useAuth = () => {
  const {
    vendor,
    token,
    isAuthenticated,
    setVendor,
    setToken,
    logout,
    setLoading,
  } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (response) => {
      if (response.success) {
        setVendor(response.data as any);
        setToken(response.data.token);
        router.replace("/(dashboard)/home");
      } else {
        Alert.alert("Login Failed", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: ({
      data,
      documents,
    }: {
      data: VendorRegistrationData;
      documents: any;
    }) => AuthService.registerVendor(data, documents),
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully. Please check your email to verify your account.",
          [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
        );
      } else {
        Alert.alert("Registration Failed", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: AuthService.googleAuth,
    onSuccess: (response) => {
      if (response.success) {
        setVendor(response.data as any);
        setToken(response.data.token);
        router.replace("/(dashboard)/home");
      } else {
        Alert.alert("Authentication Failed", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Authentication Failed",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert("Success", response.message);
        router.push("/(auth)/reset-password");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert("Success", "Password reset successfully", [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]);
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert("Success", "Password changed successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Profile query
  const profileQuery = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: AuthService.getProfile,
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Logout function
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      logout();
      queryClient.clear();
      router.replace("/(auth)/login");
    }
  };

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert("Success", "Email verified successfully");
        // Refresh profile to get updated verification status
        queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  // Resend verification email mutation
  const resendVerificationMutation = useMutation({
    mutationFn: AuthService.resendVerificationEmail,
    onSuccess: (response) => {
      if (response.success) {
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.message);
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred"
      );
    },
  });

  return {
    // State
    vendor,
    token,
    isAuthenticated,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      profileQuery.isLoading,

    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    googleAuth: googleAuthMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
    logout: handleLogout,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isGoogleAuthenticating: googleAuthMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
    isResendingVerification: resendVerificationMutation.isPending,

    // Profile data
    profile: profileQuery.data?.data,
    isProfileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
  };
};

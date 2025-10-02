import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../../components/ui/Button";
import { useVerification } from "../hooks/useVerification";

export const VerificationStatus: React.FC = () => {
  const {
    verificationStatus,
    emailVerificationStatus,
    isVerificationLoading,
    submitForReview,
    requestReVerification,
    resendEmailVerification,
    isSubmittingForReview,
    isRequestingReVerification,
    isResendingEmailVerification,
    isVerified,
    canSubmitForReview,
    needsDocuments,
    isUnderReview,
    isRejected,
  } = useVerification();

  if (isVerificationLoading) {
    return (
      <View className="bg-white rounded-lg p-6 m-4">
        <Text className="text-center text-gray-500">
          Loading verification status...
        </Text>
      </View>
    );
  }

  const getStatusColor = () => {
    if (isVerified) return "bg-green-50 border-green-200";
    if (isRejected) return "bg-red-50 border-red-200";
    if (isUnderReview) return "bg-yellow-50 border-yellow-200";
    return "bg-blue-50 border-blue-200";
  };

  const getStatusIcon = () => {
    if (isVerified) return { name: "checkmark-circle", color: "#10B981" };
    if (isRejected) return { name: "close-circle", color: "#EF4444" };
    if (isUnderReview) return { name: "time", color: "#F59E0B" };
    return { name: "information-circle", color: "#3B82F6" };
  };

  const getStatusText = () => {
    if (isVerified) return "Verified";
    if (isRejected) return "Rejected";
    if (isUnderReview) return "Under Review";
    if (needsDocuments) return "Documents Required";
    return "Pending Verification";
  };

  const statusIcon = getStatusIcon();

  return (
    <View className={`rounded-lg p-6 m-4 border ${getStatusColor()}`}>
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Ionicons
          name={statusIcon.name as any}
          size={24}
          color={statusIcon.color}
        />
        <Text className="ml-2 text-lg font-rubik-semibold text-gray-900">
          Business Verification
        </Text>
      </View>

      {/* Status */}
      <View className="mb-4">
        <Text className="text-2xl font-rubik-bold text-gray-900 mb-1">
          {getStatusText()}
        </Text>
        {verificationStatus?.verificationStage && (
          <Text className="text-gray-600 font-rubik-regular capitalize">
            Status: {verificationStatus.verificationStage.replace("_", " ")}
          </Text>
        )}
      </View>

      {/* Email Verification Status */}
      <View className="flex-row items-center mb-4">
        <Ionicons
          name={
            emailVerificationStatus?.emailVerified ? "checkmark-circle" : "mail"
          }
          size={20}
          color={emailVerificationStatus?.emailVerified ? "#10B981" : "#6B7280"}
        />
        <Text className="ml-2 text-gray-700">
          Email{" "}
          {emailVerificationStatus?.emailVerified ? "Verified" : "Not Verified"}
        </Text>
        {!emailVerificationStatus?.emailVerified && (
          <TouchableOpacity
            onPress={() => resendEmailVerification()}
            disabled={isResendingEmailVerification}
            className="ml-auto"
          >
            <Text className="text-blue-600 font-medium">
              {isResendingEmailVerification ? "Sending..." : "Resend"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Documents Status */}
      <View className="mb-4">
        <Text className="font-rubik-medium text-gray-900 mb-2">
          Required Documents:
        </Text>

        {/* Ghana Card */}
        <View className="flex-row items-center mb-2">
          <Ionicons
            name={
              verificationStatus?.requiredDocuments?.ghanaCard?.uploaded
                ? "checkmark-circle"
                : "document"
            }
            size={16}
            color={
              verificationStatus?.requiredDocuments?.ghanaCard?.uploaded
                ? "#10B981"
                : "#6B7280"
            }
          />
          <Text className="ml-2 text-gray-700 flex-1">Ghana Card</Text>
          <Text
            className={`text-sm ${
              verificationStatus?.requiredDocuments?.ghanaCard?.status ===
              "approved"
                ? "text-green-600"
                : verificationStatus?.requiredDocuments?.ghanaCard?.status ===
                    "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
            }`}
          >
            {verificationStatus?.requiredDocuments?.ghanaCard?.uploaded
              ? verificationStatus.requiredDocuments.ghanaCard.status
              : "Not uploaded"}
          </Text>
        </View>

        {/* Business Certificate */}
        <View className="flex-row items-center">
          <Ionicons
            name={
              verificationStatus?.requiredDocuments?.businessCertificate
                ?.uploaded
                ? "checkmark-circle"
                : "document"
            }
            size={16}
            color={
              verificationStatus?.requiredDocuments?.businessCertificate
                ?.uploaded
                ? "#10B981"
                : "#6B7280"
            }
          />
          <Text className="ml-2 text-gray-700 flex-1">
            Business Certificate{" "}
            {!verificationStatus?.requiredDocuments?.businessCertificate
              ?.required && "(Optional)"}
          </Text>
          <Text
            className={`text-sm ${
              verificationStatus?.requiredDocuments?.businessCertificate
                ?.status === "approved"
                ? "text-green-600"
                : verificationStatus?.requiredDocuments?.businessCertificate
                      ?.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
            }`}
          >
            {verificationStatus?.requiredDocuments?.businessCertificate
              ?.uploaded
              ? verificationStatus.requiredDocuments.businessCertificate.status
              : "Not uploaded"}
          </Text>
        </View>
      </View>

      {/* Rejection Reason */}
      {isRejected && verificationStatus?.rejectionReason && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <Text className="font-medium text-red-800 mb-1">
            Rejection Reason:
          </Text>
          <Text className="text-red-700">
            {verificationStatus.rejectionReason}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="space-y-2">
        {canSubmitForReview && (
          <Button
            title="Submit for Review"
            onPress={() => submitForReview()}
            loading={isSubmittingForReview}
          />
        )}

        {isRejected && (
          <Button
            title="Request Re-verification"
            onPress={() => requestReVerification()}
            loading={isRequestingReVerification}
            variant="outline"
          />
        )}

        {needsDocuments && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Text className="text-blue-800 font-medium mb-1">Next Steps:</Text>
            <Text className="text-blue-700">
              Please upload your Ghana Card and business certificate (if
              applicable) to proceed with verification.
            </Text>
          </View>
        )}

        {isUnderReview && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Text className="text-yellow-800 font-medium mb-1">
              Under Review
            </Text>
            <Text className="text-yellow-700">
              Your documents are being reviewed. This process typically takes
              24-48 hours.
            </Text>
          </View>
        )}

        {isVerified && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-3">
            <Text className="text-green-800 font-medium mb-1">
              Congratulations!
            </Text>
            <Text className="text-green-700">
              Your business has been verified. You can now access all vendor
              features.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

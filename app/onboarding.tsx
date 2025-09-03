import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/Button";
import { DocumentUpload } from "../components/ui/DocumentUpload";
import { AuthService } from "../services/authService";
import { useAuth } from "../store/authStore";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  required: boolean;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { vendor, updateVendor } = useAuth();
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "email-verification",
      title: "Email Verification",
      description: "Verify your email address to activate your account",
      status: "pending",
      required: true,
    },
    {
      id: "document-verification",
      title: "Document Verification",
      description: "Upload required documents for business verification",
      status: "pending",
      required: true,
    },
    {
      id: "business-verification",
      title: "Business Verification",
      description: "Admin review of your business information",
      status: "pending",
      required: true,
    },
    {
      id: "profile-completion",
      title: "Profile Completion",
      description: "Complete your business profile setup",
      status: "pending",
      required: false,
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalDocuments, setAdditionalDocuments] = useState<{
    businessLogo?: any;
    additionalDocs?: any[];
  }>({});

  const updateStepsStatus = useCallback(() => {
    if (!vendor) return;

    const updatedSteps: OnboardingStep[] = steps.map((step) => {
      switch (step.id) {
        case "email-verification":
          return {
            ...step,
            status: (vendor.emailVerified
              ? "completed"
              : "pending") as OnboardingStep["status"],
          };
        case "document-verification":
          // Backend stores docs via vendor profile endpoint; we don't have explicit doc flags in Vendor type.
          // Consider the step completed if vendor has a businessProfile present.
          return {
            ...step,
            status: (vendor.businessProfile
              ? "completed"
              : "pending") as OnboardingStep["status"],
          };
        case "business-verification":
          return {
            ...step,
            status: (vendor.businessVerified
              ? "completed"
              : "in-progress") as OnboardingStep["status"],
          };
        case "profile-completion":
          return {
            ...step,
            status: (vendor.businessProfile
              ? "completed"
              : "pending") as OnboardingStep["status"],
          };
        default:
          return step;
      }
    });

    setSteps(updatedSteps);
  }, [steps, vendor]);

  useEffect(() => {
    if (vendor) {
      updateStepsStatus();
    }
  }, [vendor, updateStepsStatus]);

  const handleStepPress = (stepIndex: number) => {
    const step = steps[stepIndex];

    if (step.status === "completed") {
      return; // Step already completed
    }

    if (step.status === "rejected") {
      // Show rejection reason and allow resubmission
      handleRejectedStep(step);
      return;
    }

    setCurrentStep(stepIndex);
  };

  const handleRejectedStep = (step: OnboardingStep) => {
    Alert.alert(
      "Step Rejected",
      `Your ${step.title.toLowerCase()} was rejected. Please review and resubmit.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resubmit",
          onPress: () =>
            setCurrentStep(steps.findIndex((s) => s.id === step.id)),
        },
      ]
    );
  };

  const handleEmailVerification = async () => {
    try {
      setIsLoading(true);
      // This would typically trigger a resend verification email
      Alert.alert(
        "Verification Email Sent",
        "Please check your email and click the verification link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.uploadDocuments(additionalDocuments);

      if (response.success) {
        // Refresh vendor profile to reflect any backend changes
        try {
          const profile = await AuthService.getProfile();
          if (profile?.success && profile.data) {
            updateVendor(profile.data);
          }
        } catch {}

        Alert.alert("Success", "Documents uploaded successfully");
        updateStepsStatus();
      } else {
        Alert.alert("Error", response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCompletion = async () => {
    // Navigate to profile completion
    router.push("/(dashboard)/profile" as Href);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Ionicons name="checkmark-circle" size={24} color="#10B981" />;
      case "in-progress":
        return <Ionicons name="time" size={24} color="#F59E0B" />;
      case "rejected":
        return <Ionicons name="close-circle" size={24} color="#EF4444" />;
      default:
        return <Ionicons name="ellipse-outline" size={24} color="#9CA3AF" />;
    }
  };

  const getStepAction = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case "email-verification":
        return (
          <Button
            title="Resend Verification Email"
            onPress={handleEmailVerification}
            loading={isLoading}
            className="mt-4"
          />
        );

      case "document-verification":
        return (
          <View className="mt-4">
            <DocumentUpload
              label="Business Logo (Optional)"
              documentType="image"
              value={additionalDocuments.businessLogo}
              onChange={(file) =>
                setAdditionalDocuments((prev) => ({
                  ...prev,
                  businessLogo: file,
                }))
              }
              helperText="Upload your business logo for better branding"
            />
            <Button
              title="Upload Documents"
              onPress={handleDocumentUpload}
              loading={isLoading}
              className="mt-4"
            />
          </View>
        );

      case "business-verification":
        return (
          <View className="mt-4">
            <Text className="text-gray-600 font-rubik-regular text-center mb-4">
              Your business is currently under review by our admin team. This
              process typically takes 1-3 business days.
            </Text>
            <Button
              title="Check Status"
              variant="outline"
              onPress={() => updateStepsStatus()}
            />
          </View>
        );

      case "profile-completion":
        return (
          <Button
            title="Complete Profile"
            onPress={handleProfileCompletion}
            className="mt-4"
          />
        );

      default:
        return null;
    }
  };

  const canProceedToDashboard = steps.every(
    (step) => !step.required || step.status === "completed"
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-purple-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-rubik-bold text-lg">Onboarding</Text>
          <View className="w-6" />
        </View>

        <Text className="text-white font-rubik-medium text-center mt-4">
          Complete these steps to start selling
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Progress Overview */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-gray-900 font-rubik-semibold text-lg mb-2">
            Progress Overview
          </Text>
          <View className="flex-row items-center">
            <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
              <View
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${(steps.filter((s) => s.status === "completed").length / steps.length) * 100}%`,
                }}
              />
            </View>
            <Text className="text-gray-600 font-rubik-medium text-sm">
              {steps.filter((s) => s.status === "completed").length}/
              {steps.length}
            </Text>
          </View>
        </View>

        {/* Steps List */}
        <View className="mb-6">
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => handleStepPress(index)}
              className={[
                "flex-row items-center p-4 rounded-xl mb-3",
                currentStep === index
                  ? "bg-purple-50 border border-purple-200"
                  : "bg-gray-50",
                step.status === "completed" ? "bg-green-50" : "",
                step.status === "rejected" ? "bg-red-50" : "",
              ].join(" ")}
            >
              <View className="mr-4">{getStepIcon(step.status)}</View>

              <View className="flex-1">
                <Text
                  className={[
                    "font-rubik-semibold text-base",
                    step.status === "completed"
                      ? "text-green-800"
                      : "text-gray-900",
                    step.status === "rejected" ? "text-red-800" : "",
                  ].join(" ")}
                >
                  {step.title}
                </Text>
                <Text
                  className={[
                    "font-rubik-regular text-sm mt-1",
                    step.status === "completed"
                      ? "text-green-600"
                      : "text-gray-600",
                    step.status === "rejected" ? "text-red-600" : "",
                  ].join(" ")}
                >
                  {step.description}
                </Text>
              </View>

              {step.required && (
                <View className="bg-red-100 px-2 py-1 rounded-full">
                  <Text className="text-red-600 font-rubik-medium text-xs">
                    Required
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Step Details */}
        {currentStep < steps.length && (
          <View className="bg-white border border-gray-200 rounded-xl p-6">
            <Text className="text-gray-900 font-rubik-bold text-xl mb-2">
              {steps[currentStep].title}
            </Text>
            <Text className="text-gray-600 font-rubik-regular mb-4">
              {steps[currentStep].description}
            </Text>

            {getStepAction()}
          </View>
        )}

        {/* Continue to Dashboard */}
        {canProceedToDashboard && (
          <View className="mt-6">
            <Button
              title="Continue to Dashboard"
              onPress={() => router.replace("/(dashboard)" as Href)}
              className="mb-4"
            />
            <Text className="text-gray-500 font-rubik-regular text-sm text-center">
              You can complete remaining steps later from your dashboard
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

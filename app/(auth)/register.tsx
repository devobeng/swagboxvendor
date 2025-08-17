import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { DocumentUpload } from "../../components/ui/DocumentUpload";
import { AuthService } from "../../services/authService";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    businessProfile: z.object({
      businessName: z
        .string()
        .min(2, "Business name must be at least 2 characters"),
      businessAddress: z
        .string()
        .min(10, "Business address must be at least 10 characters"),
      businessPhone: z
        .string()
        .min(10, "Business phone must be at least 10 characters"),
      taxId: z.string().optional(),
      bankAccount: z.string().optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ghanaCard, setGhanaCard] = useState<any>(null);
  const [businessCertificate, setBusinessCertificate] = useState<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!ghanaCard) {
      Alert.alert("Required", "Please upload your Ghana Card");
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.registerVendor(data, {
        ghanaCard,
        businessCertificate,
      });

      if (response.success) {
        Alert.alert(
          "Registration Successful",
          "Your account has been created. Please check your email to verify your account. Your business will be reviewed by admin.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Registration Failed", response.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="business" size={40} color="#9333EA" />
          </View>
          <Text className="text-2xl font-rubik-bold text-gray-900 mb-2">
            Become a Vendor
          </Text>
          <Text className="text-gray-600 font-rubik-regular text-center">
            Join our platform and start selling your products
          </Text>
        </View>

        {/* Registration Form */}
        <View className="mb-6">
          {/* Personal Information */}
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Personal Information
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                leftIcon={<Ionicons name="person" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                leftIcon={<Ionicons name="mail" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={
                  <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                }
                helperText="Minimum 6 characters"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                leftIcon={
                  <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                }
              />
            )}
          />

          {/* Business Information */}
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4 mt-6">
            Business Information
          </Text>

          <Controller
            control={control}
            name="businessProfile.businessName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Name"
                placeholder="Enter your business name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessProfile?.businessName?.message}
                leftIcon={
                  <Ionicons name="business" size={20} color="#9CA3AF" />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="businessProfile.businessAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Address"
                placeholder="Enter your business address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessProfile?.businessAddress?.message}
                leftIcon={
                  <Ionicons name="location" size={20} color="#9CA3AF" />
                }
                multiline
                numberOfLines={3}
              />
            )}
          />

          <Controller
            control={control}
            name="businessProfile.businessPhone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Phone"
                placeholder="Enter your business phone"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessProfile?.businessPhone?.message}
                leftIcon={<Ionicons name="call" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="businessProfile.taxId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Tax ID (Optional)"
                placeholder="Enter your tax ID if available"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon={<Ionicons name="card" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="businessProfile.bankAccount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Bank Account (Optional)"
                placeholder="Enter your bank account if available"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                leftIcon={<Ionicons name="card" size={20} color="#9CA3AF" />}
              />
            )}
          />

          {/* Document Upload */}
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4 mt-6">
            Required Documents
          </Text>

          <DocumentUpload
            label="Ghana Card"
            required
            documentType="image"
            value={ghanaCard}
            onChange={setGhanaCard}
            helperText="Upload a clear photo of your Ghana Card"
          />

          <DocumentUpload
            label="Business Certificate (Optional)"
            documentType="both"
            value={businessCertificate}
            onChange={setBusinessCertificate}
            helperText="Upload your business registration certificate if available"
          />
        </View>

        {/* Terms and Conditions */}
        <View className="mb-6">
          <Text className="text-gray-600 font-rubik-regular text-sm text-center">
            By signing up, you agree to our{" "}
            <Text className="text-purple-600 font-rubik-medium">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-purple-600 font-rubik-medium">
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* Register Button */}
        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          className="mb-6"
        />

        {/* Login Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600 font-rubik-regular">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-purple-600 font-rubik-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

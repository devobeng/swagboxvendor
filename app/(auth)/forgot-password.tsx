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
import { AuthService } from "../../services/authService";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.forgotPassword(data.email);

      if (response.success) {
        Alert.alert(
          "Reset Link Sent",
          "Please check your email for password reset instructions.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send reset email"
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
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="lock-open" size={40} color="#9333EA" />
          </View>
          <Text className="text-2xl font-rubik-bold text-gray-900 mb-2">
            Forgot Password?
          </Text>
          <Text className="text-gray-600 font-rubik-regular text-center">
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
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
        </View>

        {/* Submit Button */}
        <Button
          title="Send Reset Link"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          className="mb-6"
        />

        {/* Back to Login */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600 font-rubik-regular">
            Remember your password?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-purple-600 font-rubik-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

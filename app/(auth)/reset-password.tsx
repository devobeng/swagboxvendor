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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthService } from "../../services/authService";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      Alert.alert("Error", "Reset token is missing");
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.resetPassword(token, data.newPassword);

      if (response.success) {
        Alert.alert(
          "Password Reset Successfully",
          "Your password has been updated. You can now sign in with your new password.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password"
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
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={40} color="#10B981" />
          </View>
          <Text className="text-2xl font-rubik-bold text-gray-900 mb-2">
            Reset Password
          </Text>
          <Text className="text-gray-600 font-rubik-regular text-center">
            Enter your new password below.
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="New Password"
                placeholder="Enter your new password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.newPassword?.message}
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
                label="Confirm New Password"
                placeholder="Confirm your new password"
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
        </View>

        {/* Submit Button */}
        <Button
          title="Reset Password"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          className="mb-6"
        />

        {/* Back to Login */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600 font-rubik-regular">
            Remember your password?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text className="text-purple-600 font-rubik-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

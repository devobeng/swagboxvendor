import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { FormButton, FormInput } from "../../../components/ui";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, LoginFormData } from "../validations/authSchemas";

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-rubik-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 font-rubik-regular text-base">
              Sign in to your vendor account
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4">
            {/* Email or Phone Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Email or Phone Number"
                  placeholder="Enter your email or phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoComplete="username"
                  leftIcon={
                    <Ionicons name="person-outline" size={20} color="#6B7280" />
                  }
                  error={errors.email?.message}
                  required
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#6B7280"
                    />
                  }
                  rightIcon={
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                  required
                />
              )}
            />

            {/* Forgot Password Link */}
            <View className="items-end">
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-purple-600 font-rubik-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Login Button */}
            <FormButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoggingIn}
              variant="primary"
              size="lg"
              className="mt-6"
            />

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 font-rubik-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4">
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="ml-2 text-gray-700 font-rubik-medium">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 font-rubik-regular">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-purple-600 font-rubik-medium">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

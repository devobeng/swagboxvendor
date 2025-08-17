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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../store/authStore";

// Configure Google OAuth
WebBrowser.maybeCompleteAuthSession();

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { setVendor, setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(data);

      if (response.success) {
        setToken(response.data.token);
        setVendor(response.data);
        router.replace("/(dashboard)/home");
      } else {
        Alert.alert("Login Failed", response.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      // This would integrate with Google OAuth
      // For now, showing a placeholder
      Alert.alert("Google Login", "Google OAuth integration coming soon");
    } catch (error) {
      Alert.alert("Error", "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1 px-8 py-12">
        {/* Header */}
        <View className="items-center mb-10">
          <View className="w-24 h-24 bg-blue-50 rounded-2xl items-center justify-center mb-6 shadow-sm">
            <Ionicons name="business" size={48} color="#3B82F6" />
          </View>
          <Text className="text-3xl font-rubik-bold text-gray-900 mb-3">
            Welcome Back
          </Text>
          <Text className="text-gray-500 font-rubik-regular text-center text-base">
            Sign in to your vendor account to continue
          </Text>
        </View>

        {/* Login Form */}
        <View className="mb-8">
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
                leftIcon={<Ionicons name="mail" size={20} color="#6B7280" />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={
                  <Ionicons name="lock-closed" size={20} color="#6B7280" />
                }
              />
            )}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          className="items-end mb-8"
        >
          <Text className="text-blue-600 font-rubik-medium text-base">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          className="mb-6"
        />

        {/* Google Login */}
        <Button
          title="Continue with Google"
          variant="outline"
          onPress={handleGoogleLogin}
          loading={isGoogleLoading}
          className="mb-8"
        />

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400 font-rubik-medium text-sm">
            or
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-500 font-rubik-regular text-base">
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-blue-600 font-rubik-semibold text-base">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { DocumentUpload } from "../../components/ui/DocumentUpload";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../store/authStore";

const profileSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  businessAddress: z
    .string()
    .min(10, "Business address must be at least 10 characters"),
  businessPhone: z
    .string()
    .min(10, "Business phone must be at least 10 characters"),
  businessDescription: z.string().optional(),
  businessCategory: z.string().optional(),
  taxId: z.string().optional(),
  bankAccount: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const router = useRouter();
  const { vendor, updateVendor } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessLogo, setBusinessLogo] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (vendor?.businessProfile) {
      reset(vendor.businessProfile);
    }
  }, [vendor, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.updateProfile(data);

      if (response.success) {
        updateVendor({ businessProfile: data });
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Handle logout
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const getVerificationBadge = () => {
    if (!vendor) return null;

    if (vendor.businessVerified) {
      return (
        <View className="bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-800 font-rubik-medium text-sm">
            ✓ Verified
          </Text>
        </View>
      );
    } else if (vendor.emailVerified) {
      return (
        <View className="bg-yellow-100 px-3 py-1 rounded-full">
          <Text className="text-yellow-800 font-rubik-medium text-sm">
            ⏳ Pending Review
          </Text>
        </View>
      );
    } else {
      return (
        <View className="bg-red-100 px-3 py-1 rounded-full">
          <Text className="text-red-800 font-rubik-medium text-sm">
            ✗ Unverified
          </Text>
        </View>
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-rubik-bold text-gray-900">
            Profile
          </Text>

          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            className="bg-purple-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-rubik-medium">
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View className="items-center">
          <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-4">
            {businessLogo ? (
              <Ionicons name="business" size={40} color="#9333EA" />
            ) : (
              <Ionicons name="business" size={40} color="#9333EA" />
            )}
          </View>

          <Text className="text-xl font-rubik-bold text-gray-900 mb-2">
            {vendor?.name || "Vendor Name"}
          </Text>

          <Text className="text-gray-600 font-rubik-medium mb-3">
            {vendor?.email || "vendor@example.com"}
          </Text>

          {getVerificationBadge()}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Business Information Form */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Business Information
          </Text>

          <Controller
            control={control}
            name="businessName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Name"
                placeholder="Enter your business name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessName?.message}
                editable={isEditing}
                leftIcon={
                  <Ionicons name="business" size={20} color="#9CA3AF" />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="businessAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Address"
                placeholder="Enter your business address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessAddress?.message}
                editable={isEditing}
                multiline
                numberOfLines={3}
                leftIcon={
                  <Ionicons name="location" size={20} color="#9CA3AF" />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="businessPhone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Phone"
                placeholder="Enter your business phone"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.businessPhone?.message}
                editable={isEditing}
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="businessDescription"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Description (Optional)"
                placeholder="Describe your business"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={isEditing}
                multiline
                numberOfLines={4}
                leftIcon={
                  <Ionicons name="document-text" size={20} color="#9CA3AF" />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="businessCategory"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Business Category (Optional)"
                placeholder="e.g., Electronics, Fashion, Food"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={isEditing}
                leftIcon={<Ionicons name="grid" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="taxId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Tax ID (Optional)"
                placeholder="Enter your tax ID if available"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={isEditing}
                leftIcon={<Ionicons name="card" size={20} color="#9CA3AF" />}
              />
            )}
          />

          <Controller
            control={control}
            name="bankAccount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Bank Account (Optional)"
                placeholder="Enter your bank account if available"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={isEditing}
                leftIcon={<Ionicons name="card" size={20} color="#9CA3AF" />}
              />
            )}
          />

          {isEditing && (
            <Button
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              className="mt-4"
            />
          )}
        </View>

        {/* Business Logo Upload */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Business Logo
          </Text>

          <DocumentUpload
            label="Upload Business Logo"
            documentType="image"
            value={businessLogo}
            onChange={setBusinessLogo}
            helperText="Upload a professional logo for your business (recommended: 512x512px)"
          />
        </View>

        {/* Settings */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Settings
          </Text>

          <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons
                name="notifications"
                size={20}
                color="#6B7280"
                className="mr-3"
              />
              <Text className="text-gray-900 font-rubik-medium">
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#E5E7EB", true: "#9333EA" }}
              thumbColor={notificationsEnabled ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons
                name="lock-closed"
                size={20}
                color="#6B7280"
                className="mr-3"
              />
              <Text className="text-gray-900 font-rubik-medium">
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons
                name="help-circle"
                size={20}
                color="#6B7280"
                className="mr-3"
              />
              <Text className="text-gray-900 font-rubik-medium">
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Account Actions
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/onboarding")}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#6B7280"
                className="mr-3"
              />
              <Text className="text-gray-900 font-rubik-medium">
                Verification Status
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons
                name="log-out"
                size={20}
                color="#EF4444"
                className="mr-3"
              />
              <Text className="text-red-600 font-rubik-medium">Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="bg-red-50 rounded-xl border border-red-200 p-6 mb-6">
          <Text className="text-lg font-rubik-semibold text-red-800 mb-4">
            Danger Zone
          </Text>

          <Text className="text-red-700 font-rubik-regular mb-4">
            These actions cannot be undone. Please proceed with caution.
          </Text>

          <Button
            title="Deactivate Account"
            variant="danger"
            size="sm"
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Account deactivation feature coming soon"
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

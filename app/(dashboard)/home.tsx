import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { AnalyticsService } from "../../services/analyticsService";
import { AuthService } from "../../services/authService";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { vendor, logout, updateVendor } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      // Refresh vendor profile so verification status reflects backend immediately
      const profile = await AuthService.getProfile();
      if (profile?.success && profile.data) {
        updateVendor(profile.data);
      }
    } catch {}

    try {
      const res = await AnalyticsService.getDashboard();
      if (res?.success && res.data) {
        setStats(res.data);
        return;
      }
    } catch {
      // Silent failover to zeros is handled in service
    }
  }, [updateVendor]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toLocaleString()}`;
  };

  const getVerificationStatus = () => {
    if (!vendor) return { status: "unknown", color: "gray", text: "Unknown" };

    if (vendor.businessVerified) {
      return { status: "verified", color: "green", text: "Verified" };
    } else if (vendor.emailVerified) {
      return { status: "pending", color: "yellow", text: "Pending Review" };
    } else {
      return { status: "unverified", color: "red", text: "Unverified" };
    }
  };

  const navigateIfVerified = (path: Href) => {
    if (!vendor?.businessVerified) {
      Alert.alert(
        "Complete Setup",
        "Please complete your business verification before accessing this section.",
        [
          { text: "Continue Setup", onPress: () => router.push("/onboarding") },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }
    router.push(path);
  };

  const verificationStatus = getVerificationStatus();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-rubik-bold text-gray-900">
              Welcome back,
            </Text>
            <Text className="text-xl font-rubik-semibold text-purple-600">
              {vendor?.name || "Vendor"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 bg-gray-100 rounded-full"
          >
            <Ionicons name="log-out-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Verification Status */}
        <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4">
          <View className="flex-row items-center">
            <View
              className={`w-3 h-3 rounded-full bg-${verificationStatus.color}-500 mr-3`}
            />
            <Text className="text-gray-700 font-rubik-medium">
              Status: {verificationStatus.text}
            </Text>
          </View>

          {verificationStatus.status === "unverified" && (
            <TouchableOpacity
              onPress={() => router.push("/onboarding")}
              className="bg-purple-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-rubik-medium text-sm">
                Complete Setup
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => navigateIfVerified("/(dashboard)/products")}
              className="flex-1 bg-white p-4 rounded-xl border border-gray-200 items-center"
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="add-circle" size={24} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 font-rubik-medium text-sm text-center">
                Add Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateIfVerified("/(dashboard)/orders")}
              className="flex-1 bg-white p-4 rounded-xl border border-gray-200 items-center"
            >
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="list" size={24} color="#10B981" />
              </View>
              <Text className="text-gray-900 font-rubik-medium text-sm text-center">
                View Orders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/profile")}
              className="flex-1 bg-white p-4 rounded-xl border border-gray-200 items-center"
            >
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="settings" size={24} color="#9333EA" />
              </View>
              <Text className="text-gray-900 font-rubik-medium text-sm text-center">
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Cards */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Overview
          </Text>

          <View className="space-y-3">
            {/* Revenue Card */}
            <View className="bg-white p-4 rounded-xl border border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-rubik-medium">
                  Total Revenue
                </Text>
                <Ionicons name="trending-up" size={20} color="#10B981" />
              </View>
              <Text className="text-2xl font-rubik-bold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </Text>
              <Text className="text-gray-500 font-rubik-regular text-sm">
                This month: {formatCurrency(stats.monthlyRevenue)}
              </Text>
            </View>

            {/* Products & Orders Row */}
            <View className="flex-row space-x-3">
              <View className="flex-1 bg-white p-4 rounded-xl border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 font-rubik-medium">
                    Products
                  </Text>
                  <Ionicons name="cube" size={20} color="#3B82F6" />
                </View>
                <Text className="text-2xl font-rubik-bold text-gray-900">
                  {stats.totalProducts}
                </Text>
                <Text className="text-gray-500 font-rubik-regular text-sm">
                  Active listings
                </Text>
              </View>

              <View className="flex-1 bg-white p-4 rounded-xl border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 font-rubik-medium">
                    Orders
                  </Text>
                  <Ionicons name="list" size={20} color="#F59E0B" />
                </View>
                <Text className="text-2xl font-rubik-bold text-gray-900">
                  {stats.totalOrders}
                </Text>
                <Text className="text-gray-500 font-rubik-regular text-sm">
                  {stats.pendingOrders} pending
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
            Recent Activity
          </Text>

          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={20} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-rubik-medium">
                    New order received
                  </Text>
                  <Text className="text-gray-500 font-rubik-regular text-sm">
                    Order #12345 - 2 hours ago
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="cube" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-rubik-medium">
                    Product updated
                  </Text>
                  <Text className="text-gray-500 font-rubik-regular text-sm">
                    iPhone 13 Pro - 1 day ago
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="star" size={20} color="#9333EA" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-rubik-medium">
                    New review received
                  </Text>
                  <Text className="text-gray-500 font-rubik-regular text-sm">
                    5-star review - 2 days ago
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Onboarding Reminder */}
        {verificationStatus.status !== "verified" && (
          <View className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="information-circle" size={24} color="#9333EA" />
              <Text className="text-purple-800 font-rubik-semibold ml-2">
                Complete Your Setup
              </Text>
            </View>
            <Text className="text-purple-700 font-rubik-regular mb-4">
              Complete the onboarding process to start selling on our platform.
            </Text>
            <Button
              title="Continue Setup"
              onPress={() => router.push("/onboarding")}
              size="sm"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

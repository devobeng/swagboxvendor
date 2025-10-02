import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { useVerification } from "../../verification/hooks/useVerification";
import { VerificationStatus } from "../../verification/components/VerificationStatus";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onPress?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1 mx-1"
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-gray-600 font-rubik-regular text-sm mb-1">
          {title}
        </Text>
        <Text className="text-2xl font-rubik-bold text-gray-900">{value}</Text>
      </View>
      <View className={`p-3 rounded-full ${color}`}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
    </View>
  </TouchableOpacity>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-3"
  >
    <View className="flex-row items-center">
      <View className={`p-3 rounded-full ${color} mr-4`}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="font-rubik-semibold text-gray-900 mb-1">{title}</Text>
        <Text className="text-gray-600 font-rubik-regular text-sm">
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
);

export const VendorDashboard: React.FC = () => {
  const router = useRouter();
  const { vendor, profile, isProfileLoading } = useAuth();
  const { verificationStatus, isVerified, refetchVerification } =
    useVerification();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchVerification();
    } finally {
      setRefreshing(false);
    }
  }, [refetchVerification]);

  const quickActions = [
    {
      title: "Add Product",
      description: "Add new products to your store",
      icon: "add-circle",
      color: "bg-blue-500",
      onPress: () => router.push("/(dashboard)/products/add"),
    },
    {
      title: "Manage Orders",
      description: "View and manage customer orders",
      icon: "receipt",
      color: "bg-green-500",
      onPress: () => router.push("/(dashboard)/orders"),
    },
    {
      title: "Store Settings",
      description: "Update your store information",
      icon: "storefront",
      color: "bg-purple-500",
      onPress: () => router.push("/(dashboard)/store-settings"),
    },
    {
      title: "Analytics",
      description: "View sales and performance data",
      icon: "analytics",
      color: "bg-orange-500",
      onPress: () => router.push("/(dashboard)/analytics"),
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-white px-6 py-8 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-rubik-bold text-gray-900">
              Welcome back, {vendor?.name || "Vendor"}!
            </Text>
            <Text className="text-gray-600 font-rubik-regular mt-1">
              {vendor?.businessProfile?.businessName || "Your Business"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(dashboard)/profile")}
            className="p-2"
          >
            <Ionicons name="person-circle" size={32} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Verification Status */}
      {!isVerified && <VerificationStatus />}

      {/* Dashboard Cards */}
      <View className="px-4 py-6">
        <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
          Overview
        </Text>
        <View className="flex-row mb-6">
          <DashboardCard
            title="Total Products"
            value="0"
            icon="cube"
            color="bg-blue-500"
            onPress={() => router.push("/(dashboard)/products")}
          />
          <DashboardCard
            title="Orders Today"
            value="0"
            icon="receipt"
            color="bg-green-500"
            onPress={() => router.push("/(dashboard)/orders")}
          />
        </View>
        <View className="flex-row">
          <DashboardCard
            title="Revenue"
            value="₵0"
            icon="cash"
            color="bg-purple-500"
            onPress={() => router.push("/(dashboard)/analytics")}
          />
          <DashboardCard
            title="Customers"
            value="0"
            icon="people"
            color="bg-orange-500"
            onPress={() => router.push("/(dashboard)/customers")}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 pb-6">
        <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
          Quick Actions
        </Text>
        {quickActions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </View>

      {/* Business Status */}
      <View className="px-4 pb-8">
        <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Business Status
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name={vendor?.emailVerified ? "checkmark-circle" : "mail"}
                  size={20}
                  color={vendor?.emailVerified ? "#10B981" : "#F59E0B"}
                />
                <Text className="ml-2 text-gray-700">Email Verification</Text>
              </View>
              <Text
                className={`font-medium ${
                  vendor?.emailVerified ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {vendor?.emailVerified ? "Verified" : "Pending"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    vendor?.businessVerified ? "checkmark-circle" : "business"
                  }
                  size={20}
                  color={vendor?.businessVerified ? "#10B981" : "#F59E0B"}
                />
                <Text className="ml-2 text-gray-700">
                  Business Verification
                </Text>
              </View>
              <Text
                className={`font-medium ${
                  vendor?.businessVerified
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {vendor?.businessVerified ? "Verified" : "Pending"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name={vendor?.isActive ? "checkmark-circle" : "pause-circle"}
                  size={20}
                  color={vendor?.isActive ? "#10B981" : "#EF4444"}
                />
                <Text className="ml-2 text-gray-700">Account Status</Text>
              </View>
              <Text
                className={`font-medium ${
                  vendor?.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {vendor?.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

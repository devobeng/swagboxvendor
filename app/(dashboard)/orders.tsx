import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/Button";

export default function OrdersScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
        <Text className="text-2xl font-rubik-bold text-gray-900">Orders</Text>
        <Text className="text-gray-600 font-rubik-regular mt-2">
          Track and manage your orders
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8 items-center justify-center">
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="list" size={48} color="#10B981" />
        </View>

        <Text className="text-xl font-rubik-semibold text-gray-900 mb-2 text-center">
          Order Management
        </Text>

        <Text className="text-gray-600 font-rubik-regular text-center mb-8 max-w-xs">
          This feature is coming soon. You'll be able to view, track, and manage
          your orders here.
        </Text>

        <Button title="Coming Soon" variant="outline" disabled />
      </View>
    </View>
  );
}

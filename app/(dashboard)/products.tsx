import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/Button";

export default function ProductsScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
        <Text className="text-2xl font-rubik-bold text-gray-900">Products</Text>
        <Text className="text-gray-600 font-rubik-regular mt-2">
          Manage your product catalog
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8 items-center justify-center">
        <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="cube" size={48} color="#3B82F6" />
        </View>

        <Text className="text-xl font-rubik-semibold text-gray-900 mb-2 text-center">
          Product Management
        </Text>

        <Text className="text-gray-600 font-rubik-regular text-center mb-8 max-w-xs">
          This feature is coming soon. You'll be able to add, edit, and manage
          your products here.
        </Text>

        <Button title="Coming Soon" variant="outline" disabled />
      </View>
    </View>
  );
}

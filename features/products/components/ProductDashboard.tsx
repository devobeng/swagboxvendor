import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FormButton } from "../../../components/ui";
import { useProductStats, useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export const ProductDashboard: React.FC = () => {
  const router = useRouter();
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useProductStats();
  const {
    data: recentProducts,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useProducts({
    sortBy: "newest",
    limit: 4,
  });

  const stats = statsData?.data;
  const products = recentProducts?.data.products || [];

  const handleRefresh = () => {
    refetchStats();
    refetchProducts();
  };

  const renderStatCard = (
    title: string,
    value: number,
    icon: string,
    color: string,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      className={`bg-white rounded-lg p-4 border-l-4 ${color} shadow-sm flex-1`}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-rubik-bold text-gray-900">
            {value}
          </Text>
          <Text className="text-gray-600 font-rubik-regular text-sm">
            {title}
          </Text>
        </View>
        <View
          className={`p-3 rounded-full ${color.replace("border-l-", "bg-").replace("-500", "-100")}`}
        >
          <Ionicons
            name={icon as any}
            size={24}
            color={
              color.includes("purple")
                ? "#9333EA"
                : color.includes("green")
                  ? "#10B981"
                  : color.includes("yellow")
                    ? "#F59E0B"
                    : color.includes("red")
                      ? "#EF4444"
                      : "#6B7280"
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickActions = () => (
    <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
        Quick Actions
      </Text>

      <View className="flex-row flex-wrap gap-3">
        <FormButton
          title="Add Product"
          onPress={() => router.push("/products/add")}
          variant="primary"
          size="sm"
          leftIcon="add"
          className="flex-1"
        />

        <FormButton
          title="View All"
          onPress={() => router.push("/products")}
          variant="outline"
          size="sm"
          leftIcon="list"
          className="flex-1"
        />
      </View>

      <View className="flex-row flex-wrap gap-3 mt-3">
        <FormButton
          title="Low Stock"
          onPress={() => router.push("/products?filter=low-stock")}
          variant="outline"
          size="sm"
          leftIcon="warning"
          className="flex-1"
        />

        <FormButton
          title="Drafts"
          onPress={() => router.push("/products?status=draft")}
          variant="outline"
          size="sm"
          leftIcon="document-text"
          className="flex-1"
        />
      </View>
    </View>
  );

  const renderRecentProducts = () => (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-rubik-semibold text-gray-900">
          Recent Products
        </Text>
        <TouchableOpacity onPress={() => router.push("/products")}>
          <Text className="text-purple-600 font-rubik-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <View className="items-center py-8">
          <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 font-rubik-medium mt-2">
            No products yet
          </Text>
          <Text className="text-gray-400 font-rubik-regular text-sm text-center mt-1">
            Add your first product to get started
          </Text>
          <FormButton
            title="Add Product"
            onPress={() => router.push("/products/add")}
            variant="primary"
            size="sm"
            className="mt-4"
          />
        </View>
      ) : (
        <View className="flex-row flex-wrap justify-between">
          {products.slice(0, 2).map((product) => (
            <ProductCard key={product._id} product={product} viewMode="grid" />
          ))}
        </View>
      )}
    </View>
  );

  const renderInsights = () => {
    if (!stats) return null;

    const insights = [];

    if (stats.lowStock > 0) {
      insights.push({
        type: "warning",
        title: "Low Stock Alert",
        message: `${stats.lowStock} products are running low on stock`,
        action: () => router.push("/products?filter=low-stock"),
        icon: "warning",
        color: "text-orange-600",
      });
    }

    if (stats.outOfStock > 0) {
      insights.push({
        type: "error",
        title: "Out of Stock",
        message: `${stats.outOfStock} products are out of stock`,
        action: () => router.push("/products?filter=out-of-stock"),
        icon: "alert-circle",
        color: "text-red-600",
      });
    }

    if (stats.draft > stats.published) {
      insights.push({
        type: "info",
        title: "Unpublished Products",
        message: `You have ${stats.draft} draft products ready to publish`,
        action: () => router.push("/products?status=draft"),
        icon: "information-circle",
        color: "text-blue-600",
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: "success",
        title: "All Good!",
        message: "Your products are in good shape",
        icon: "checkmark-circle",
        color: "text-green-600",
      });
    }

    return (
      <View className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
          Insights
        </Text>

        {insights.map((insight, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2"
            onPress={insight.action}
          >
            <Ionicons
              name={insight.icon as any}
              size={20}
              color={
                insight.color.includes("orange")
                  ? "#F59E0B"
                  : insight.color.includes("red")
                    ? "#EF4444"
                    : insight.color.includes("blue")
                      ? "#3B82F6"
                      : "#10B981"
              }
            />
            <View className="flex-1 ml-3">
              <Text className="font-rubik-medium text-gray-900">
                {insight.title}
              </Text>
              <Text className="text-gray-600 font-rubik-regular text-sm">
                {insight.message}
              </Text>
            </View>
            {insight.action && (
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (statsLoading || productsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600 font-rubik-regular">
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={statsLoading || productsLoading}
          onRefresh={handleRefresh}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-rubik-bold text-gray-900 mb-2">
            Product Dashboard
          </Text>
          <Text className="text-gray-600 font-rubik-regular">
            Manage your products and track performance
          </Text>
        </View>

        {/* Stats Cards */}
        {stats && (
          <View className="mb-6">
            <View className="flex-row space-x-3 mb-3">
              {renderStatCard(
                "Total Products",
                stats.total,
                "cube",
                "border-l-purple-500",
                () => router.push("/products")
              )}
              {renderStatCard(
                "Published",
                stats.published,
                "checkmark-circle",
                "border-l-green-500",
                () => router.push("/products?status=published")
              )}
            </View>

            <View className="flex-row space-x-3">
              {renderStatCard(
                "Drafts",
                stats.draft,
                "document-text",
                "border-l-yellow-500",
                () => router.push("/products?status=draft")
              )}
              {renderStatCard(
                "Low Stock",
                stats.lowStock,
                "warning",
                "border-l-red-500",
                () => router.push("/products?filter=low-stock")
              )}
            </View>
          </View>
        )}

        {/* Insights */}
        {renderInsights()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Recent Products */}
        {renderRecentProducts()}
      </View>
    </ScrollView>
  );
};

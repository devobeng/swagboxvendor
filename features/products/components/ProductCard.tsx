import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";
import { useDeleteProduct, useUpdateProductStatus } from "../hooks/useProducts";

interface ProductCardProps {
  product: Product;
  viewMode?: "list" | "grid";
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onStatusChange?: (
    product: Product,
    status: "draft" | "published" | "hidden"
  ) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const router = useRouter();
  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "hidden":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (totalStock: number) => {
    if (totalStock === 0)
      return { text: "Out of Stock", color: "text-red-600" };
    if (totalStock < 10) return { text: "Low Stock", color: "text-orange-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    } else {
      router.push(`/products/edit/${product._id}`);
    }
  };

  const handleDelete = () => {
    const deleteAction = () => {
      if (onDelete) {
        onDelete(product);
      } else {
        deleteProductMutation.mutate(product._id!);
      }
    };

    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAction,
        },
      ]
    );
  };

  const handleStatusChange = (status: "draft" | "published" | "hidden") => {
    if (onStatusChange) {
      onStatusChange(product, status);
    } else {
      updateStatusMutation.mutate({ id: product._id!, status });
    }
  };

  const handlePress = () => {
    router.push(`/products/${product._id}`);
  };

  const stockStatus = getStockStatus(product.totalStock);

  const renderStatusMenu = () => (
    <View className="absolute top-8 right-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
      <TouchableOpacity
        className="px-4 py-2 flex-row items-center"
        onPress={() => handleStatusChange("published")}
      >
        <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
        <Text className="text-gray-700 font-rubik-regular">Published</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="px-4 py-2 flex-row items-center"
        onPress={() => handleStatusChange("draft")}
      >
        <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <Text className="text-gray-700 font-rubik-regular">Draft</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="px-4 py-2 flex-row items-center"
        onPress={() => handleStatusChange("hidden")}
      >
        <View className="w-3 h-3 rounded-full bg-gray-500 mr-2" />
        <Text className="text-gray-700 font-rubik-regular">Hidden</Text>
      </TouchableOpacity>
    </View>
  );

  if (viewMode === "list") {
    return (
      <TouchableOpacity
        className="bg-white rounded-lg border border-gray-200 mb-3 p-4 shadow-sm"
        onPress={handlePress}
      >
        <View className="flex-row">
          <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 mr-4">
            {mainImage ? (
              <Image
                source={{ uri: mainImage.uri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="image-outline" size={24} color="#9CA3AF" />
              </View>
            )}
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-rubik-semibold text-gray-900 flex-1 mr-2">
                {product.title}
              </Text>
              <View className="flex-row space-x-1">
                <TouchableOpacity
                  className="p-2 bg-gray-50 rounded-lg"
                  onPress={handleEdit}
                >
                  <Ionicons name="pencil" size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 bg-red-50 rounded-lg"
                  onPress={handleDelete}
                >
                  <Ionicons name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <Text
              className="text-gray-600 font-rubik-regular mb-2"
              numberOfLines={2}
            >
              {product.description}
            </Text>

            <View className="flex-row items-center mb-2">
              <Text className="text-gray-500 text-sm font-rubik-regular mr-2">
                Category:
              </Text>
              <Text className="text-gray-700 text-sm font-rubik-medium">
                {product.category}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-rubik-bold text-gray-900">
                  ${product.basePrice.toFixed(2)}
                </Text>
                {product.salePrice && (
                  <Text className="text-sm text-red-600 font-rubik-medium">
                    Sale: ${product.salePrice.toFixed(2)}
                  </Text>
                )}
              </View>

              <View className="items-end">
                <TouchableOpacity
                  className={`px-3 py-1 rounded-full mb-1 ${getStatusColor(
                    product.status
                  )}`}
                  onPress={() => {}}
                >
                  <Text className="text-xs font-rubik-medium capitalize">
                    {product.status}
                  </Text>
                </TouchableOpacity>
                <Text
                  className={`text-xs font-rubik-medium ${stockStatus.color}`}
                >
                  {stockStatus.text} ({product.totalStock})
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid view
  return (
    <TouchableOpacity
      className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden shadow-sm"
      style={{ width: "48%" }}
      onPress={handlePress}
    >
      <View className="aspect-square bg-gray-100 relative">
        {mainImage ? (
          <Image
            source={{ uri: mainImage.uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          </View>
        )}

        {/* Status badge */}
        <TouchableOpacity
          className={`absolute top-2 left-2 px-2 py-1 rounded-full ${getStatusColor(
            product.status
          )}`}
          onPress={() => {}}
        >
          <Text className="text-xs font-rubik-medium capitalize">
            {product.status}
          </Text>
        </TouchableOpacity>

        {/* Action buttons */}
        <View className="absolute top-2 right-2 flex-row space-x-1">
          <TouchableOpacity
            className="bg-white/90 backdrop-blur rounded-full p-1.5"
            onPress={handleEdit}
          >
            <Ionicons name="pencil" size={14} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white/90 backdrop-blur rounded-full p-1.5"
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Video indicator */}
        {product.video && (
          <View className="absolute bottom-2 left-2 bg-black/70 rounded-full p-1">
            <Ionicons name="play" size={12} color="white" />
          </View>
        )}
      </View>

      <View className="p-3">
        <Text
          className="text-sm font-rubik-semibold text-gray-900 mb-1"
          numberOfLines={2}
        >
          {product.title}
        </Text>

        <Text
          className="text-xs text-gray-500 font-rubik-regular mb-2"
          numberOfLines={1}
        >
          {product.category}
        </Text>

        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-lg font-rubik-bold text-gray-900">
              ${product.basePrice.toFixed(2)}
            </Text>
            {product.salePrice && (
              <Text className="text-sm text-red-600 font-rubik-medium line-through">
                ${product.salePrice.toFixed(2)}
              </Text>
            )}
          </View>

          <View className="items-end">
            <Text className={`text-xs font-rubik-medium ${stockStatus.color}`}>
              {product.totalStock} units
            </Text>
          </View>
        </View>

        {/* Variants indicator */}
        {product.variants.length > 1 && (
          <View className="flex-row items-center">
            <Ionicons name="options" size={12} color="#6B7280" />
            <Text className="text-xs text-gray-500 font-rubik-regular ml-1">
              {product.variants.length} variants
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

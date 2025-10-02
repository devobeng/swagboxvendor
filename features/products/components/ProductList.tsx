import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FormInput, FormSelect, FormButton } from "../../../components/ui";
import {
  useProducts,
  useDeleteProduct,
  useUpdateProductStatus,
} from "../hooks/useProducts";
import { Product, ProductFilters, PRODUCT_CATEGORIES } from "../types";

interface ProductListProps {
  viewMode?: "list" | "grid";
}

export const ProductList: React.FC<ProductListProps> = ({
  viewMode = "grid",
}) => {
  const router = useRouter();
  const [filters, setFilters] = useState<ProductFilters>({
    status: "all",
    sortBy: "newest",
    page: 1,
    limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: productsData, isLoading, refetch } = useProducts(filters);
  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();

  const products = productsData?.data.products || [];
  const pagination = productsData?.data.pagination;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProductMutation.mutate(product._id!),
        },
      ]
    );
  };

  const handleStatusChange = (
    product: Product,
    status: "draft" | "published" | "hidden"
  ) => {
    updateStatusMutation.mutate({ id: product._id!, status });
  };

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

  const renderProductCard = ({ item: product }: { item: Product }) => {
    const stockStatus = getStockStatus(product.totalStock);
    const mainImage =
      product.images.find((img) => img.isMain) || product.images[0];

    if (viewMode === "list") {
      return (
        <TouchableOpacity
          className="bg-white rounded-lg border border-gray-200 mb-3 p-4"
          onPress={() => router.push(`/products/${product._id}`)}
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
                    className="p-1"
                    onPress={() => router.push(`/products/edit/${product._id}`)}
                  >
                    <Ionicons name="pencil" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => handleDeleteProduct(product)}
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
                  <View
                    className={`px-2 py-1 rounded-full mb-1 ${getStatusColor(
                      product.status
                    )}`}
                  >
                    <Text className="text-xs font-rubik-medium capitalize">
                      {product.status}
                    </Text>
                  </View>
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
        className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden"
        style={{ width: "48%" }}
        onPress={() => router.push(`/products/${product._id}`)}
      >
        <View className="aspect-square bg-gray-100">
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
          <View
            className={`absolute top-2 left-2 px-2 py-1 rounded-full ${getStatusColor(
              product.status
            )}`}
          >
            <Text className="text-xs font-rubik-medium capitalize">
              {product.status}
            </Text>
          </View>

          {/* Action buttons */}
          <View className="absolute top-2 right-2 flex-row space-x-1">
            <TouchableOpacity
              className="bg-white rounded-full p-1.5"
              onPress={() => router.push(`/products/edit/${product._id}`)}
            >
              <Ionicons name="pencil" size={14} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white rounded-full p-1.5"
              onPress={() => handleDeleteProduct(product)}
            >
              <Ionicons name="trash" size={14} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-3">
          <Text
            className="text-sm font-rubik-semibold text-gray-900 mb-1"
            numberOfLines={2}
          >
            {product.title}
          </Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-rubik-bold text-gray-900">
              ${product.basePrice.toFixed(2)}
            </Text>
            {product.salePrice && (
              <Text className="text-sm text-red-600 font-rubik-medium">
                ${product.salePrice.toFixed(2)}
              </Text>
            )}
          </View>

          <Text className={`text-xs font-rubik-medium ${stockStatus.color}`}>
            {stockStatus.text} ({product.totalStock})
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilters = () => (
    <View className="bg-white p-4 border-b border-gray-200">
      <View className="space-y-4">
        <View className="flex-row space-x-3">
          <FormSelect
            label=""
            placeholder="All Status"
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
            options={[
              { label: "All Status", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Hidden", value: "hidden" },
              { label: "Archived", value: "archived" },
            ]}
            className="flex-1"
          />

          <FormSelect
            label=""
            placeholder="All Categories"
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
            options={[
              { label: "All Categories", value: "" },
              ...PRODUCT_CATEGORIES.map((cat) => ({ label: cat, value: cat })),
            ]}
            className="flex-1"
            searchable
          />
        </View>

        <FormSelect
          label=""
          placeholder="Sort by"
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
          options={[
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
            { label: "Price: Low to High", value: "price_low" },
            { label: "Price: High to Low", value: "price_high" },
            { label: "Name: A to Z", value: "name_asc" },
            { label: "Name: Z to A", value: "name_desc" },
          ]}
        />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="bg-white p-4 border-b border-gray-200">
      <View className="flex-row items-center space-x-3 mb-4">
        <View className="flex-1">
          <FormInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            leftIcon={<Ionicons name="search" size={20} color="#6B7280" />}
          />
        </View>

        <TouchableOpacity
          className={`p-3 rounded-lg ${
            showFilters ? "bg-purple-600" : "bg-gray-100"
          }`}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="filter"
            size={20}
            color={showFilters ? "#FFFFFF" : "#6B7280"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="p-3 bg-purple-600 rounded-lg"
          onPress={() => router.push("/products/add")}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 font-rubik-regular">
          {pagination?.total || 0} products found
        </Text>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            className={`p-2 rounded ${
              viewMode === "grid" ? "bg-purple-100" : "bg-gray-100"
            }`}
            onPress={() => {}}
          >
            <Ionicons
              name="grid"
              size={16}
              color={viewMode === "grid" ? "#9333EA" : "#6B7280"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-purple-100" : "bg-gray-100"
            }`}
            onPress={() => {}}
          >
            <Ionicons
              name="list"
              size={16}
              color={viewMode === "list" ? "#9333EA" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
      <Text className="text-xl font-rubik-semibold text-gray-900 mt-4 mb-2">
        No products found
      </Text>
      <Text className="text-gray-600 font-rubik-regular text-center mb-6">
        {searchQuery || filters.category || filters.status !== "all"
          ? "Try adjusting your search or filters"
          : "Start by adding your first product"}
      </Text>
      <FormButton
        title="Add Product"
        onPress={() => router.push("/products/add")}
        variant="primary"
        leftIcon="add"
      />
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600 font-rubik-regular">
          Loading products...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}
      {showFilters && renderFilters()}

      {products.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item._id!}
          numColumns={viewMode === "grid" ? 2 : 1}
          columnWrapperStyle={
            viewMode === "grid"
              ? { justifyContent: "space-between" }
              : undefined
          }
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

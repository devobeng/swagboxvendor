import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ProductService } from "../services/productService";
import { Product, ProductFormData, ProductFilters } from "../types";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: () => [...productKeys.all, "stats"] as const,
};

// Get products with filters
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => ProductService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
  });
};

// Get product statistics
export const useProductStats = () => {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => ProductService.getProductStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => ProductService.createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Product created successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create product"
      );
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductFormData>;
    }) => ProductService.updateProduct(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Product updated successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update product"
      );
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Product deleted successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete product"
      );
    },
  });
};

// Archive product mutation
export const useArchiveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.archiveProduct(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Product archived successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to archive product"
      );
    },
  });
};

// Update product status mutation
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "draft" | "published" | "hidden";
    }) => ProductService.updateProductStatus(id, status),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Product status updated successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update product status"
      );
    },
  });
};

// Duplicate product mutation
export const useDuplicateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.duplicateProduct(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Product duplicated successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to duplicate product"
      );
    },
  });
};

// Bulk update products mutation
export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productIds,
      updates,
    }: {
      productIds: string[];
      updates: {
        status?: "draft" | "published" | "hidden" | "archived";
        category?: string;
      };
    }) => ProductService.bulkUpdateProducts(productIds, updates),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      Alert.alert(
        "Success",
        response.message || "Products updated successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update products"
      );
    },
  });
};

// Search products
export const useSearchProducts = (
  query: string,
  filters?: {
    category?: string;
    status?: string;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ["products", "search", query, filters],
    queryFn: () => ProductService.searchProducts(query, filters),
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 30 * 1000, // 30 seconds
  });
};

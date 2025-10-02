import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { ProductService } from "../services/productService";
import { productKeys } from "./useProducts";

// Add product variant
export const useAddVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      variant,
    }: {
      productId: string;
      variant: {
        size?: string;
        color?: string;
        material?: string;
        sku?: string;
        price: number;
        salePrice?: number;
        stock: number;
      };
    }) => ProductService.addVariant(productId, variant),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      Alert.alert("Success", response.message || "Variant added successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add variant"
      );
    },
  });
};

// Update product variant
export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      variant,
    }: {
      productId: string;
      variantId: string;
      variant: {
        size?: string;
        color?: string;
        material?: string;
        sku?: string;
        price?: number;
        salePrice?: number;
        stock?: number;
        isActive?: boolean;
      };
    }) => ProductService.updateVariant(productId, variantId, variant),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      Alert.alert(
        "Success",
        response.message || "Variant updated successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update variant"
      );
    },
  });
};

// Delete product variant
export const useDeleteVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId: string;
    }) => ProductService.deleteVariant(productId, variantId),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      Alert.alert(
        "Success",
        response.message || "Variant deleted successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete variant"
      );
    },
  });
};

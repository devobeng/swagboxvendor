import { api } from "../../../services/api";
import {
  Product,
  ProductFormData,
  ProductFilters,
  ProductStats,
} from "../types";

export interface ProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message: string;
}

export interface ProductStatsResponse {
  success: boolean;
  data: ProductStats;
  message: string;
}

export class ProductService {
  // Get all vendor products with filters
  static async getProducts(
    filters?: ProductFilters
  ): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.sortBy) {
      params.append("sortBy", filters.sortBy);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const response = await api.get(`/vendor/products?${params.toString()}`);
    return response.data;
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<ProductResponse> {
    const response = await api.get(`/vendor/products/${id}`);
    return response.data;
  }

  // Create new product
  static async createProduct(data: ProductFormData): Promise<ProductResponse> {
    const response = await api.post("/vendor/products", data);
    return response.data;
  }

  // Update product
  static async updateProduct(
    id: string,
    data: Partial<ProductFormData>
  ): Promise<ProductResponse> {
    const response = await api.put(`/vendor/products/${id}`, data);
    return response.data;
  }

  // Delete product
  static async deleteProduct(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/vendor/products/${id}`);
    return response.data;
  }

  // Archive product
  static async archiveProduct(id: string): Promise<ProductResponse> {
    const response = await api.patch(`/vendor/products/${id}/archive`);
    return response.data;
  }

  // Update product status
  static async updateProductStatus(
    id: string,
    status: "draft" | "published" | "hidden"
  ): Promise<ProductResponse> {
    const response = await api.patch(`/vendor/products/${id}/status`, {
      status,
    });
    return response.data;
  }

  // Upload product images
  static async uploadImages(
    productId: string,
    images: any[]
  ): Promise<{
    success: boolean;
    data: { images: Array<{ id: string; uri: string; order: number }> };
    message: string;
  }> {
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append("images", image);
      formData.append(`order_${index}`, index.toString());
    });

    const response = await api.post(
      `/vendor/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Reorder product images
  static async reorderImages(
    productId: string,
    imageOrders: Array<{ id: string; order: number }>
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.patch(
      `/vendor/products/${productId}/images/reorder`,
      {
        imageOrders,
      }
    );
    return response.data;
  }

  // Delete product image
  static async deleteImage(
    productId: string,
    imageId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(
      `/vendor/products/${productId}/images/${imageId}`
    );
    return response.data;
  }

  // Upload product video
  static async uploadVideo(
    productId: string,
    video: any
  ): Promise<{
    success: boolean;
    data: { video: { id: string; uri: string; thumbnail?: string } };
    message: string;
  }> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await api.post(
      `/vendor/products/${productId}/video`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Delete product video
  static async deleteVideo(productId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(`/vendor/products/${productId}/video`);
    return response.data;
  }

  // Add product variant
  static async addVariant(
    productId: string,
    variant: {
      size?: string;
      color?: string;
      material?: string;
      sku?: string;
      price: number;
      salePrice?: number;
      stock: number;
    }
  ): Promise<{
    success: boolean;
    data: { variant: any };
    message: string;
  }> {
    const response = await api.post(
      `/vendor/products/${productId}/variants`,
      variant
    );
    return response.data;
  }

  // Update product variant
  static async updateVariant(
    productId: string,
    variantId: string,
    variant: {
      size?: string;
      color?: string;
      material?: string;
      sku?: string;
      price?: number;
      salePrice?: number;
      stock?: number;
      isActive?: boolean;
    }
  ): Promise<{
    success: boolean;
    data: { variant: any };
    message: string;
  }> {
    const response = await api.put(
      `/vendor/products/${productId}/variants/${variantId}`,
      variant
    );
    return response.data;
  }

  // Delete product variant
  static async deleteVariant(
    productId: string,
    variantId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.delete(
      `/vendor/products/${productId}/variants/${variantId}`
    );
    return response.data;
  }

  // Get product statistics
  static async getProductStats(): Promise<ProductStatsResponse> {
    const response = await api.get("/vendor/products/stats");
    return response.data;
  }

  // Duplicate product
  static async duplicateProduct(id: string): Promise<ProductResponse> {
    const response = await api.post(`/vendor/products/${id}/duplicate`);
    return response.data;
  }

  // Bulk update products
  static async bulkUpdateProducts(
    productIds: string[],
    updates: {
      status?: "draft" | "published" | "hidden" | "archived";
      category?: string;
    }
  ): Promise<{
    success: boolean;
    data: { updated: number };
    message: string;
  }> {
    const response = await api.patch("/vendor/products/bulk", {
      productIds,
      updates,
    });
    return response.data;
  }

  // Search products
  static async searchProducts(
    query: string,
    filters?: {
      category?: string;
      status?: string;
      limit?: number;
    }
  ): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    params.append("q", query);

    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const response = await api.get(
      `/vendor/products/search?${params.toString()}`
    );
    return response.data;
  }
}

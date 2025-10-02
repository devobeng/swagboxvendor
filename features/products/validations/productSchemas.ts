import { z } from "zod";
import { PRODUCT_CATEGORIES } from "../types";

// Product variant validation
export const productVariantSchema = z.object({
  id: z.string(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().min(0, "Sale price must be positive").optional(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  isActive: z.boolean().default(true),
});

// Product dimensions validation
export const dimensionsSchema = z.object({
  length: z.number().min(0, "Length must be positive"),
  width: z.number().min(0, "Width must be positive"),
  height: z.number().min(0, "Height must be positive"),
});

// Product form validation
export const productFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description cannot exceed 2000 characters"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    basePrice: z.number().min(0.01, "Base price must be greater than 0"),
    salePrice: z.number().min(0, "Sale price must be positive").optional(),
    tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").default([]),
    brand: z
      .string()
      .max(50, "Brand name cannot exceed 50 characters")
      .optional(),
    weight: z.number().min(0, "Weight must be positive").optional(),
    dimensions: dimensionsSchema.optional(),
    status: z.enum(["draft", "published", "hidden"]).default("draft"),
  })
  .refine(
    (data) => {
      if (data.salePrice && data.salePrice >= data.basePrice) {
        return false;
      }
      return true;
    },
    {
      message: "Sale price must be less than base price",
      path: ["salePrice"],
    }
  );

// Product variant form validation
export const variantFormSchema = z
  .object({
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().min(0.01, "Price must be greater than 0"),
    salePrice: z.number().min(0, "Sale price must be positive").optional(),
    stock: z.number().int().min(0, "Stock must be non-negative"),
  })
  .refine(
    (data) => {
      if (data.salePrice && data.salePrice >= data.price) {
        return false;
      }
      return true;
    },
    {
      message: "Sale price must be less than regular price",
      path: ["salePrice"],
    }
  );

// Product filters validation
export const productFiltersSchema = z.object({
  status: z
    .enum(["all", "draft", "published", "hidden", "archived"])
    .optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum([
      "newest",
      "oldest",
      "price_low",
      "price_high",
      "name_asc",
      "name_desc",
    ])
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Export types
export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductVariantFormData = z.infer<typeof variantFormSchema>;
export type ProductFiltersData = z.infer<typeof productFiltersSchema>;
export type ProductVariantData = z.infer<typeof productVariantSchema>;
export type DimensionsData = z.infer<typeof dimensionsSchema>;

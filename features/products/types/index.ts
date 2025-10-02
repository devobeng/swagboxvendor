export interface ProductImage {
  id: string;
  uri: string;
  order: number;
  isMain?: boolean;
}

export interface ProductVideo {
  id: string;
  uri: string;
  thumbnail?: string;
  duration?: number;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  material?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  _id?: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  salePrice?: number;
  images: ProductImage[];
  video?: ProductVideo;
  variants: ProductVariant[];
  tags: string[];
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  status: "draft" | "published" | "hidden" | "archived";
  isActive: boolean;
  totalStock: number;
  vendor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  salePrice?: number;
  tags: string[];
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  status: "draft" | "published" | "hidden";
}

export interface ProductFilters {
  status?: "all" | "draft" | "published" | "hidden" | "archived";
  category?: string;
  search?: string;
  sortBy?:
    | "newest"
    | "oldest"
    | "price_low"
    | "price_high"
    | "name_asc"
    | "name_desc";
  page?: number;
  limit?: number;
}

export interface ProductStats {
  total: number;
  published: number;
  draft: number;
  hidden: number;
  archived: number;
  lowStock: number;
  outOfStock: number;
}

// Common product categories
export const PRODUCT_CATEGORIES = [
  "Fashion & Clothing",
  "Electronics",
  "Home & Garden",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Books & Media",
  "Toys & Games",
  "Automotive",
  "Health & Wellness",
  "Food & Beverages",
  "Art & Crafts",
  "Office Supplies",
  "Pet Supplies",
  "Jewelry & Accessories",
  "Industrial & Scientific",
] as const;

// Common sizes
export const PRODUCT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "One Size",
] as const;

// Common colors
export const PRODUCT_COLORS = [
  "Black",
  "White",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Brown",
  "Navy",
  "Beige",
  "Gold",
  "Silver",
  "Multicolor",
] as const;

// Common materials
export const PRODUCT_MATERIALS = [
  "Cotton",
  "Polyester",
  "Wool",
  "Silk",
  "Leather",
  "Denim",
  "Plastic",
  "Metal",
  "Wood",
  "Glass",
  "Ceramic",
  "Rubber",
  "Synthetic",
  "Organic",
  "Recycled",
] as const;

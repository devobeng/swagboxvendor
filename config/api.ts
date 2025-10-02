export const API_BASE_URL = "http://192.168.24.202:8000/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER_VENDOR: `${API_BASE_URL}/auth/register-vendor`,
    GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },

  // Vendor endpoints
  VENDOR: {
    PROFILE: `${API_BASE_URL}/auth/me`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    UPLOAD_DOCUMENTS: `${API_BASE_URL}/users/upload-documents`,
    VERIFICATION_STATUS: `${API_BASE_URL}/auth/me`,
    ANALYTICS: `${API_BASE_URL}/vendor/analytics`,
    ORDERS: `${API_BASE_URL}/vendor/orders`,
    PRODUCTS: `${API_BASE_URL}/vendor/products`,
    COMMENTS: `${API_BASE_URL}/vendor/comments`,
  },

  // Business endpoints
  BUSINESS: {
    CREATE: `${API_BASE_URL}/business`,
    UPDATE: (id: string) => `${API_BASE_URL}/business/${id}`,
    GET: (id: string) => `${API_BASE_URL}/business/${id}`,
    UPLOAD_LOGO: `${API_BASE_URL}/business/upload-logo`,
  },

  // Products endpoints
  PRODUCTS: {
    LIST: `${API_BASE_URL}/vendor/products`,
    CREATE: `${API_BASE_URL}/vendor/products`,
    UPDATE: (id: string) => `${API_BASE_URL}/vendor/products/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/vendor/products/${id}`,
    GET: (id: string) => `${API_BASE_URL}/vendor/products/${id}`,
    STATS: `${API_BASE_URL}/vendor/products/stats`,
    SEARCH: `${API_BASE_URL}/vendor/products/search`,
    DUPLICATE: (id: string) =>
      `${API_BASE_URL}/vendor/products/${id}/duplicate`,
    ARCHIVE: (id: string) => `${API_BASE_URL}/vendor/products/${id}/archive`,
    STATUS: (id: string) => `${API_BASE_URL}/vendor/products/${id}/status`,
    BULK: `${API_BASE_URL}/vendor/products/bulk`,

    // Media endpoints
    IMAGES: (id: string) => `${API_BASE_URL}/vendor/products/${id}/images`,
    REORDER_IMAGES: (id: string) =>
      `${API_BASE_URL}/vendor/products/${id}/images/reorder`,
    DELETE_IMAGE: (productId: string, imageId: string) =>
      `${API_BASE_URL}/vendor/products/${productId}/images/${imageId}`,

    VIDEO: (id: string) => `${API_BASE_URL}/vendor/products/${id}/video`,

    // Variants endpoints
    VARIANTS: (id: string) => `${API_BASE_URL}/vendor/products/${id}/variants`,
    UPDATE_VARIANT: (productId: string, variantId: string) =>
      `${API_BASE_URL}/vendor/products/${productId}/variants/${variantId}`,
    DELETE_VARIANT: (productId: string, variantId: string) =>
      `${API_BASE_URL}/vendor/products/${productId}/variants/${variantId}`,
  },

  // Categories endpoints
  CATEGORIES: {
    LIST: `${API_BASE_URL}/categories`,
    GET: (id: string) => `${API_BASE_URL}/categories/${id}`,
  },
};

export const UPLOAD_ENDPOINTS = {
  GHANA_CARD: `${API_BASE_URL}/users/upload-documents`,
  BUSINESS_CERTIFICATE: `${API_BASE_URL}/users/upload-documents`,
  BUSINESS_LOGO: `${API_BASE_URL}/business/upload-logo`,
  PROFILE_PICTURE: `${API_BASE_URL}/users/profile-picture`,
  STORE_BANNER: `${API_BASE_URL}/business/upload-banner`,

  // Product media uploads
  PRODUCT_IMAGES: (productId: string) =>
    `${API_BASE_URL}/vendor/products/${productId}/images`,
  PRODUCT_VIDEO: (productId: string) =>
    `${API_BASE_URL}/vendor/products/${productId}/video`,
};

export const API_BASE_URL = "http://192.168.14.202:8000/api";

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
    UPDATE_PROFILE: `${API_BASE_URL}/auth/vendor/profile`,
    UPLOAD_DOCUMENTS: `${API_BASE_URL}/auth/vendor/profile`,
    VERIFICATION_STATUS: `${API_BASE_URL}/auth/me`,
  },

  // Business endpoints
  BUSINESS: {
    CREATE: `${API_BASE_URL}/business`,
    UPDATE: (id: string) => `${API_BASE_URL}/business/${id}`,
    GET: (id: string) => `${API_BASE_URL}/business/${id}`,
    UPLOAD_LOGO: `${API_BASE_URL}/business/upload-logo`,
  },
};

export const UPLOAD_ENDPOINTS = {
  GHANA_CARD: `${API_BASE_URL}/auth/vendor/profile`,
  BUSINESS_CERTIFICATE: `${API_BASE_URL}/auth/vendor/profile`,
  BUSINESS_LOGO: `${API_BASE_URL}/business/upload-logo`,
};

import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((val) => {
      // Check if it's a valid email
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // Check if it's a valid phone number
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, "Please enter a valid email address or phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration validation schema
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
    businessProfile: z.object({
      businessName: z
        .string()
        .min(2, "Business name must be at least 2 characters")
        .max(100, "Business name cannot exceed 100 characters"),
      businessAddress: z
        .string()
        .min(10, "Business address must be at least 10 characters")
        .max(200, "Business address cannot exceed 200 characters"),
      businessPhone: z
        .string()
        .min(10, "Business phone must be at least 10 characters")
        .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
      businessCategory: z.string().min(1, "Please select a business category"),
      businessDescription: z
        .string()
        .max(500, "Business description cannot exceed 500 characters")
        .optional(),
      taxId: z.string().optional(),
      bankAccount: z.string().optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Change password validation schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// Business categories
export const BUSINESS_CATEGORIES = [
  "Fashion & Clothing",
  "Electronics & Technology",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books & Education",
  "Food & Beverages",
  "Automotive",
  "Arts & Crafts",
  "Jewelry & Accessories",
  "Baby & Kids",
  "Pet Supplies",
  "Office Supplies",
  "Industrial & Scientific",
  "Other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

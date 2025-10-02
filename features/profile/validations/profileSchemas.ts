import { z } from "zod";
import { BUSINESS_CATEGORIES } from "../../auth/validations/authSchemas";

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

// Business profile update validation schema
export const businessProfileUpdateSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name cannot exceed 100 characters")
    .optional(),
  businessAddress: z
    .string()
    .min(10, "Business address must be at least 10 characters")
    .max(200, "Business address cannot exceed 200 characters")
    .optional(),
  businessPhone: z
    .string()
    .min(10, "Business phone must be at least 10 characters")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
  businessCategory: z.enum(BUSINESS_CATEGORIES).optional(),
  businessDescription: z
    .string()
    .max(500, "Business description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  bankAccount: z.string().optional().or(z.literal("")),
});

// Store settings validation schema
export const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name cannot exceed 100 characters"),
  storeDescription: z
    .string()
    .max(500, "Store description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  storeLocation: z
    .object({
      address: z
        .string()
        .min(10, "Address must be at least 10 characters")
        .max(200, "Address cannot exceed 200 characters"),
      city: z
        .string()
        .min(2, "City must be at least 2 characters")
        .max(50, "City cannot exceed 50 characters"),
      region: z
        .string()
        .min(2, "Region must be at least 2 characters")
        .max(50, "Region cannot exceed 50 characters"),
    })
    .optional(),
  contactDetails: z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
    whatsapp: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid WhatsApp number")
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .url("Please enter a valid website URL")
      .optional()
      .or(z.literal("")),
  }),
  businessHours: z
    .object({
      monday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
      tuesday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
      wednesday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
      thursday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
      friday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
      saturday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
      sunday: z
        .object({
          open: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          close: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
          closed: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  socialMedia: z
    .object({
      facebook: z
        .string()
        .url("Please enter a valid Facebook URL")
        .optional()
        .or(z.literal("")),
      instagram: z
        .string()
        .url("Please enter a valid Instagram URL")
        .optional()
        .or(z.literal("")),
      twitter: z
        .string()
        .url("Please enter a valid Twitter URL")
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url("Please enter a valid LinkedIn URL")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

// Ghana regions
export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Brong-Ahafo",
  "Western North",
  "Ahafo",
  "Bono",
  "Bono East",
  "Oti",
  "North East",
  "Savannah",
] as const;

// Type exports
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type BusinessProfileUpdateFormData = z.infer<
  typeof businessProfileUpdateSchema
>;
export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
export type GhanaRegion = (typeof GHANA_REGIONS)[number];

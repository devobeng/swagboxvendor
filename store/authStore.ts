import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  role: "vendor";
  businessVerified: boolean;
  emailVerified: boolean;
  businessProfile?: {
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    taxId?: string;
    bankAccount?: string;
  };
}

interface AuthState {
  vendor: Vendor | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setVendor: (vendor: Vendor) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateVendor: (updates: Partial<Vendor>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      vendor: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setVendor: (vendor: Vendor) =>
        set({ vendor, isAuthenticated: true, isLoading: false }),

      setToken: (token: string) => set({ token, isLoading: false }),

      logout: () =>
        set({
          vendor: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      updateVendor: (updates: Partial<Vendor>) =>
        set((state) => ({
          vendor: state.vendor ? { ...state.vendor, ...updates } : null,
        })),

      // Initialize loading state after hydration
      initialize: () => set({ isLoading: false }),
    }),
    {
      name: "vendor-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        vendor: state.vendor,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Set loading to false after rehydration
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

export const useAuth = () => useAuthStore();

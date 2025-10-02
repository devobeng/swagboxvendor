# SwagBox Vendor App - Feature-Based Architecture

This document outlines the vendor authentication and account management features built using a feature-based folder approach with Expo Router integration.

## 🏗️ Architecture Overview

The app follows a feature-based folder structure where each feature is self-contained with its own:

- **Types**: TypeScript interfaces and type definitions
- **Services**: API communication layer
- **Hooks**: Custom React hooks for state management
- **Components**: Reusable UI components
- **Validations**: Form validation schemas using Zod

## 📁 Project Structure

```
swagboxvendor/
├── features/
│   ├── auth/                     # Authentication Feature
│   │   ├── types/index.ts        # Auth types & interfaces
│   │   ├── services/authService.ts # Auth API calls
│   │   ├── hooks/useAuth.ts      # Auth state management
│   │   ├── components/           # Auth UI components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── validations/authSchemas.ts # Form validation
│   │
│   ├── profile/                  # Profile & Store Settings Feature
│   │   ├── types/index.ts        # Profile types
│   │   ├── services/profileService.ts # Profile API calls
│   │   ├── hooks/useProfile.ts   # Profile state management
│   │   └── validations/profileSchemas.ts # Profile validation
│   │
│   ├── verification/             # Business Verification Feature
│   │   ├── types/index.ts        # Verification types
│   │   ├── services/verificationService.ts # Verification API
│   │   ├── hooks/useVerification.ts # Verification state
│   │   └── components/VerificationStatus.tsx # Verification UI
│   │
│   └── dashboard/                # Dashboard Feature
│       └── components/VendorDashboard.tsx # Main dashboard
│
├── components/ui/                # Shared UI Components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── DocumentUpload.tsx
│   └── ImagePicker.tsx
│
├── app/                          # Expo Router Pages
│   ├── (auth)/                   # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   └── (dashboard)/              # Dashboard screens
│       └── home.tsx
│
├── store/                        # Global State Management
│   └── authStore.ts              # Zustand auth store
│
├── services/                     # Shared Services
│   └── api.ts                    # Axios configuration
│
└── config/                       # Configuration
    └── api.ts                    # API endpoints
```

## 🚀 Features Implemented

### 1. Authentication & Account Management ✅

#### Vendor Registration

- **Multi-step registration form** with validation
- **Personal Information**: Name, email, password, phone (optional)
- **Business Information**: Business name, category, address, phone, description
- **Document Upload**: Ghana Card (required), Business Certificate (optional)
- **Real-time validation** using Zod schemas
- **Progress indicator** showing current step

#### Vendor Login

- **Email/password authentication**
- **Password visibility toggle**
- **Form validation** with error handling
- **Google OAuth integration** (placeholder)
- **Forgot password** functionality

#### Password Management

- **Forgot password** with email verification
- **Reset password** with token validation
- **Change password** for authenticated users
- **Strong password requirements**

### 2. Profile & Store Settings ✅

#### Vendor Profile Management

- **Personal information** updates (name, phone)
- **Business profile** management
- **Profile picture** upload
- **Real-time profile** synchronization

#### Store Settings

- **Store name and description**
- **Store logo and banner** upload
- **Store location** with address details
- **Contact details** (email, phone, WhatsApp, website)
- **Business hours** configuration
- **Social media** links integration

#### Business Profile

- **Business information** updates
- **Category selection** from predefined list
- **Tax ID and bank account** (optional)
- **Business description** management

### 3. Business Verification ✅

#### Document Management

- **Ghana Card upload** (required)
- **Business Certificate upload** (optional)
- **Document status tracking** (pending, approved, rejected)
- **Multiple file format support** (images, PDFs)

#### Verification Process

- **Email verification** with resend functionality
- **Business verification** status tracking
- **Verification stages**: pending → under_review → approved/rejected
- **Rejection reason** display
- **Re-verification** requests

#### Verification Status Dashboard

- **Real-time status** updates
- **Document checklist** with upload status
- **Action buttons** for next steps
- **Progress indicators** and notifications

### 4. Backend Integration ✅

#### API Configuration

- **Centralized API endpoints** configuration
- **Environment-specific** base URLs
- **Axios interceptors** for authentication
- **Error handling** and retry logic

#### State Management

- **Zustand store** for authentication state
- **React Query** for server state management
- **Persistent storage** with AsyncStorage
- **Optimistic updates** and cache invalidation

#### Real-time Updates

- **Profile synchronization** with backend
- **Verification status** polling
- **Document upload** progress tracking
- **Error handling** with user feedback

## 🛠️ Technical Implementation

### Form Validation

```typescript
// Example: Registration validation schema
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    businessProfile: z.object({
      businessName: z.string().min(2, "Business name required"),
      businessCategory: z.string().min(1, "Please select a category"),
      // ... more fields
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

### API Service Layer

```typescript
// Example: Auth service with error handling
export class AuthService {
  static async registerVendor(
    data: VendorRegistrationData,
    documents: DocumentUploadData
  ): Promise<AuthResponse> {
    const formData = new FormData();

    // Add form data
    formData.append("name", data.name);
    formData.append("businessProfile", JSON.stringify(data.businessProfile));

    // Add documents
    if (documents.ghanaCard) {
      formData.append("ghanaCard", documents.ghanaCard);
    }

    const response = await api.post(
      API_ENDPOINTS.AUTH.REGISTER_VENDOR,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  }
}
```

### Custom Hooks

```typescript
// Example: useAuth hook with React Query
export const useAuth = () => {
  const { vendor, setVendor, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (response) => {
      if (response.success) {
        setVendor(response.data);
        router.replace("/(dashboard)/home");
      }
    },
    onError: (error) => {
      Alert.alert("Login Failed", error.message);
    },
  });

  return {
    vendor,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    logout,
  };
};
```

## 📱 User Experience Features

### Multi-step Registration

- **Progress indicator** showing current step
- **Step validation** before proceeding
- **Back/forward navigation** between steps
- **Auto-save** draft data

### Document Upload

- **Camera and gallery** options
- **File type validation** (images, PDFs)
- **Upload progress** indicators
- **Preview functionality** for uploaded files

### Real-time Feedback

- **Loading states** for all async operations
- **Success/error alerts** with descriptive messages
- **Form validation** with inline error messages
- **Optimistic UI updates**

### Responsive Design

- **Mobile-first** approach
- **Consistent spacing** and typography
- **Accessible components** with proper labels
- **Dark mode** support (configurable)

## 🔐 Security Features

### Authentication

- **JWT token** management
- **Secure storage** with AsyncStorage
- **Token refresh** handling
- **Automatic logout** on token expiry

### Data Validation

- **Client-side validation** with Zod
- **Server-side validation** sync
- **Input sanitization**
- **File type validation**

### Privacy

- **Secure document** upload
- **Personal data** encryption
- **GDPR compliance** considerations

## 🚀 Getting Started

### Prerequisites

```bash
# Install dependencies
npm install

# Required packages for this implementation
npm install @react-native-picker/picker
```

### Environment Setup

```typescript
// config/api.ts
export const API_BASE_URL = "http://your-backend-url:8000/api";
```

### Running the App

```bash
# Start the development server
npm start

# Run on specific platform
npm run android
npm run ios
```

## 🔄 Backend Integration

### Required Backend Endpoints

- `POST /auth/register-vendor` - Vendor registration
- `POST /auth/login` - Vendor login
- `GET /auth/me` - Get current vendor profile
- `PATCH /users/profile` - Update vendor profile
- `PATCH /users/upload-documents` - Upload verification documents
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Expected Response Format

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}
```

## 🧪 Testing Considerations

### Unit Tests

- **Form validation** schemas
- **API service** methods
- **Custom hooks** logic
- **Utility functions**

### Integration Tests

- **Authentication flow**
- **Registration process**
- **Document upload**
- **Profile management**

### E2E Tests

- **Complete registration** journey
- **Login and logout** flow
- **Verification process**
- **Profile updates**

## 📈 Future Enhancements

### Planned Features

- **Product management** (add, edit, delete products)
- **Order management** (view, process orders)
- **Analytics dashboard** (sales, performance metrics)
- **Inventory management** (stock tracking)
- **Customer communication** (chat, notifications)
- **Payment integration** (Stripe, PayPal)
- **Multi-language support**
- **Advanced search** and filtering

### Technical Improvements

- **Offline support** with data sync
- **Push notifications**
- **Advanced caching** strategies
- **Performance optimization**
- **Accessibility improvements**
- **Automated testing** suite

## 🤝 Contributing

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Feature-based** folder structure
- **Consistent naming** conventions

### Pull Request Process

1. **Create feature branch** from main
2. **Implement feature** with tests
3. **Update documentation**
4. **Submit pull request** with description
5. **Code review** and approval
6. **Merge to main**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Expo, React Native, TypeScript, and modern development practices.**

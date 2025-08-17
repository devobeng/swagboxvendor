# SwagBox Vendor App

A comprehensive vendor registration and onboarding mobile application built with React Native and Expo.

## 🚀 Features

### Authentication & Registration

- **Vendor Sign-up**: Complete registration with email/phone and social login support
- **Profile Creation**: Business information, tax ID, bank account details
- **Document Upload**: Ghana Card and business certificate verification
- **Admin Approval Workflow**: Multi-step verification process

### Onboarding Flow

- **Step-by-step Setup**: Guided onboarding with progress tracking
- **Document Verification**: Upload and manage required documents
- **Business Profile**: Complete business information setup
- **Status Tracking**: Real-time verification status updates

### Dashboard

- **Overview Dashboard**: Revenue, products, and orders summary
- **Quick Actions**: Easy access to common tasks
- **Recent Activity**: Latest updates and notifications
- **Verification Status**: Clear indication of account status

### Profile Management

- **Business Information**: Edit company details and contact info
- **Document Management**: Upload and update business documents
- **Settings**: Notification preferences and account settings
- **Security**: Password management and account security

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Styling**: NativeWind (Tailwind CSS)
- **Icons**: Expo Vector Icons
- **HTTP Client**: Axios
- **Type Safety**: TypeScript

### Project Structure

```
swagboxvendor/
├── app/                          # Main app screens
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx           # Login screen
│   │   ├── register.tsx        # Vendor registration
│   │   ├── forgot-password.tsx # Password recovery
│   │   └── reset-password.tsx  # Password reset
│   ├── (dashboard)/            # Dashboard screens
│   │   ├── home.tsx            # Dashboard home
│   │   ├── products.tsx        # Product management
│   │   ├── orders.tsx          # Order management
│   │   └── profile.tsx         # Profile settings
│   ├── onboarding.tsx          # Onboarding flow
│   ├── _layout.tsx             # Root layout
│   └── index.tsx               # Entry point
├── components/                  # Reusable UI components
│   └── ui/                     # UI components
│       ├── Button.tsx          # Custom button component
│       ├── Input.tsx           # Form input component
│       └── DocumentUpload.tsx  # File upload component
├── config/                     # Configuration files
│   └── api.ts                  # API endpoints
├── services/                   # API services
│   ├── api.ts                  # Axios configuration
│   └── authService.ts          # Authentication service
├── store/                      # State management
│   ├── authStore.ts            # Authentication store
│   └── index.ts                # Store exports
├── global.css                  # Global styles
└── package.json                # Dependencies
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd swagboxvendor
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 📱 Screens & Navigation

### Authentication Flow

1. **Login Screen**: Email/password authentication
2. **Registration Screen**: Complete vendor signup
3. **Forgot Password**: Password recovery
4. **Reset Password**: Set new password

### Onboarding Flow

1. **Email Verification**: Verify email address
2. **Document Upload**: Upload required documents
3. **Business Verification**: Admin review process
4. **Profile Completion**: Complete business profile

### Dashboard

1. **Home**: Overview and quick actions
2. **Products**: Product management (coming soon)
3. **Orders**: Order management (coming soon)
4. **Profile**: Account settings and management

## 🔌 API Integration

### Backend Endpoints

The app integrates with the SwagBox backend API:

- **Authentication**: `/api/auth/*`
- **Vendor Management**: `/api/auth/vendor/*`
- **Business Profile**: `/api/business/*`
- **Document Upload**: `/api/upload/*`

### Key API Features

- JWT token authentication
- File upload support
- Form validation
- Error handling
- Request/response interceptors

## 🎨 Design System

### Colors

- **Primary**: Purple (#9333EA)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (#6B7280, #9CA3AF, #E5E7EB)

### Typography

- **Font Family**: Rubik (Google Fonts)
- **Weights**: Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black
- **Sizes**: xs, sm, base, lg, xl, 2xl

### Components

- **Buttons**: Primary, Secondary, Outline, Danger variants
- **Inputs**: Text, email, password, multiline with validation
- **Cards**: Clean, rounded design with shadows
- **Navigation**: Bottom tabs with icons

## 🔐 Security Features

### Authentication

- JWT token-based authentication
- Secure token storage
- Automatic token refresh
- Logout functionality

### Data Protection

- Form validation with Zod
- Secure file uploads
- Input sanitization
- Error handling

## 📋 Validation & Forms

### Form Validation

- **Zod Schema**: Type-safe validation
- **React Hook Form**: Efficient form management
- **Real-time Validation**: Instant feedback
- **Error Handling**: User-friendly error messages

### Required Fields

- Business name, address, phone
- Ghana Card (required document)
- Business certificate (optional)
- Email verification

## 🚀 Production Deployment

### Build Configuration

1. **Environment Setup**: Configure production API endpoints
2. **Asset Optimization**: Optimize images and fonts
3. **Bundle Analysis**: Analyze bundle size
4. **Testing**: Comprehensive testing on devices

### App Store Deployment

1. **iOS**: Build and submit to App Store
2. **Android**: Build APK/AAB for Google Play
3. **Code Signing**: Configure certificates and keys
4. **Release Notes**: Prepare app store descriptions

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
API_BASE_URL=http://localhost:3000/api

# Google OAuth (coming soon)
GOOGLE_CLIENT_ID=your_google_client_id
```

### API Endpoints

Update `config/api.ts` with your backend URLs:

```typescript
export const API_BASE_URL = "https://your-backend.com/api";
```

## 📱 Platform Support

### iOS

- iOS 13.0+
- iPhone and iPad support
- Native iOS components

### Android

- Android 6.0+ (API level 23)
- Material Design components
- Native Android features

### Web

- Responsive web design
- Progressive Web App support
- Cross-browser compatibility

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Component testing
- **Integration Tests**: API integration
- **E2E Tests**: User flow testing
- **Device Testing**: Real device validation

### Test Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📚 Documentation

### API Documentation

- Backend API endpoints
- Request/response formats
- Authentication flows
- Error codes

### Component Documentation

- UI component usage
- Props and variants
- Examples and demos
- Accessibility guidelines

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow TypeScript and React Native best practices
2. **Component Design**: Reusable, accessible components
3. **Testing**: Write tests for new features
4. **Documentation**: Update docs for changes

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas

### Contact

- **Email**: support@swagbox.com
- **Documentation**: [docs.swagbox.com](https://docs.swagbox.com)
- **Community**: [community.swagbox.com](https://community.swagbox.com)

---

**Built with ❤️ by the SwagBox Team**

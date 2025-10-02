import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
// import { Picker } from "@react-native-picker/picker";
import {
  FormButton,
  FormInput,
  FormTextArea,
  FormSelect,
  DocumentUpload,
} from "../../../components/ui";
import { useAuth } from "../hooks/useAuth";
import {
  registerSchema,
  RegisterFormData,
  BUSINESS_CATEGORIES,
} from "../validations/authSchemas";

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [ghanaCard, setGhanaCard] = useState<any>(null);
  const [businessCertificate, setBusinessCertificate] = useState<any>(null);

  const { register, isRegistering } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      businessProfile: {
        businessName: "",
        businessAddress: "",
        businessPhone: "",
        businessCategory: "",
        businessDescription: "",
        taxId: "",
        bankAccount: "",
      },
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    if (!ghanaCard) {
      Alert.alert(
        "Required Document",
        "Ghana Card is required for registration"
      );
      return;
    }

    register({
      data,
      documents: {
        ghanaCard,
        businessCertificate,
      },
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "name",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["businessProfile"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Personal Info", icon: "person-outline" },
      { number: 2, title: "Business Info", icon: "business-outline" },
      { number: 3, title: "Verification", icon: "shield-checkmark-outline" },
    ];

    return (
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          {steps.map((step, index) => (
            <View key={step.number} className="flex-1 items-center">
              <View
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.number <= currentStep ? "bg-purple-600" : "bg-gray-400"
                }`}
              >
                <Ionicons
                  name={step.icon as any}
                  size={20}
                  color={step.number <= currentStep ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>
              <Text
                className={`text-xs font-rubik-medium text-center ${
                  step.number <= currentStep
                    ? "text-purple-600"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </Text>
              {index < steps.length - 1 && (
                <View
                  className="absolute top-5 flex-row items-center justify-center"
                  style={{
                    left: "50%",
                    right: "-50%",
                    width: "100%",
                  }}
                >
                  <View
                    className={`flex-1 h-0.5 ${
                      step.number < currentStep
                        ? "bg-purple-600"
                        : "bg-gray-400"
                    }`}
                  />
                  <View className="mx-2">
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={step.number < currentStep ? "#9333EA" : "#9CA3AF"}
                    />
                  </View>
                  <View
                    className={`flex-1 h-0.5 ${
                      step.number < currentStep
                        ? "bg-purple-600"
                        : "bg-gray-400"
                    }`}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPersonalInfoStep = () => (
    <View className="space-y-4">
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Personal Information
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Full Name"
            placeholder="Enter your full name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            leftIcon={
              <Ionicons name="person-outline" size={20} color="#6B7280" />
            }
            error={errors.name?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Email Address"
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
            }
            error={errors.email?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
            leftIcon={
              <Ionicons name="call-outline" size={20} color="#6B7280" />
            }
            error={errors.phone?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Password"
            placeholder="Enter your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={!showPassword}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            }
            rightIcon={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={!showConfirmPassword}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            }
            rightIcon={
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            }
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            error={errors.confirmPassword?.message}
            required
          />
        )}
      />
    </View>
  );

  const renderBusinessInfoStep = () => (
    <View className="space-y-4">
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Business Information
      </Text>

      <Controller
        control={control}
        name="businessProfile.businessName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Business Name"
            placeholder="Enter your business name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            leftIcon={
              <Ionicons name="business-outline" size={20} color="#6B7280" />
            }
            error={errors.businessProfile?.businessName?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="businessProfile.businessCategory"
        render={({ field: { onChange, value } }) => (
          <FormSelect
            label="Business Category"
            placeholder="Select your business category"
            value={value}
            onValueChange={onChange}
            options={BUSINESS_CATEGORIES.map((cat) => ({
              label: cat,
              value: cat,
            }))}
            error={errors.businessProfile?.businessCategory?.message}
            required
            searchable
          />
        )}
      />

      <Controller
        control={control}
        name="businessProfile.businessAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTextArea
            label="Business Address"
            placeholder="Enter your business address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            rows={3}
            error={errors.businessProfile?.businessAddress?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="businessProfile.businessPhone"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Business Phone"
            placeholder="Enter your business phone"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
            leftIcon={
              <Ionicons name="call-outline" size={20} color="#6B7280" />
            }
            error={errors.businessProfile?.businessPhone?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="businessProfile.businessDescription"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTextArea
            label="Business Description (Optional)"
            placeholder="Describe your business"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            rows={4}
            maxLength={500}
            showCharCount={true}
            error={errors.businessProfile?.businessDescription?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="businessProfile.taxId"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Tax ID (Optional)"
            placeholder="Enter your tax ID"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            leftIcon={
              <Ionicons name="receipt-outline" size={20} color="#6B7280" />
            }
            error={errors.businessProfile?.taxId?.message}
          />
        )}
      />
    </View>
  );

  const renderDocumentsStep = () => (
    <View className="space-y-6">
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Business Verification
      </Text>

      <Text className="text-gray-600 font-rubik-regular mb-4">
        Upload the required documents to verify your business. All documents
        should be clear and readable.
      </Text>

      <DocumentUpload
        label="Ghana Card (Required)"
        helperText="Upload a clear photo of your Ghana Card"
        onChange={setGhanaCard}
        value={ghanaCard}
        required
      />

      <DocumentUpload
        label="Business Certificate (Optional)"
        helperText="Upload your business registration certificate"
        onChange={setBusinessCertificate}
        value={businessCertificate}
      />

      <View className="bg-purple-50 p-4 rounded-lg">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={20} color="#9333EA" />
          <View className="ml-2 flex-1">
            <Text className="text-purple-800 font-rubik-medium mb-1">
              Verification Process
            </Text>
            <Text className="text-purple-700 font-rubik-regular text-sm">
              Your documents will be reviewed by our team within 24-48 hours.
              You&apos;ll receive an email notification once verification is
              complete.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
        enabled={true}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 150,
            minHeight: "100%",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
        >
          <View className="px-6 py-8">
            {renderStepIndicator()}

            {currentStep === 1 && renderPersonalInfoStep()}
            {currentStep === 2 && renderBusinessInfoStep()}
            {currentStep === 3 && renderDocumentsStep()}

            {/* Navigation Buttons */}
            <View className="flex-row justify-between mt-8">
              {currentStep > 1 && (
                <FormButton
                  title="Previous"
                  onPress={prevStep}
                  variant="outline"
                  size="lg"
                  className="flex-1 mr-2"
                />
              )}

              {currentStep < 3 ? (
                <FormButton
                  title="Next"
                  onPress={nextStep}
                  variant="primary"
                  size="lg"
                  rightIcon="chevron-forward"
                  className={currentStep === 1 ? "flex-1" : "flex-1 ml-2"}
                />
              ) : (
                <FormButton
                  title="Create Account"
                  onPress={handleSubmit(onSubmit)}
                  loading={isRegistering}
                  variant="primary"
                  size="lg"
                  className={currentStep === 1 ? "flex-1" : "flex-1 ml-2"}
                />
              )}
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 font-rubik-regular">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-purple-600 font-rubik-medium">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

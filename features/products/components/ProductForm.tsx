import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  FormInput,
  FormTextArea,
  FormSelect,
  FormButton,
} from "../../../components/ui";
import { ImageUpload } from "./ImageUpload";
import { VideoUpload } from "./VideoUpload";
import { VariantManager } from "./VariantManager";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import { useUploadImages, useUploadVideo } from "../hooks/useProductMedia";
import {
  Product,
  ProductImage,
  ProductVideo,
  ProductVariant,
  PRODUCT_CATEGORIES,
} from "../types";
import {
  productFormSchema,
  ProductFormData,
} from "../validations/productSchemas";

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isEditing = false,
}) => {
  const router = useRouter();
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const [video, setVideo] = useState<ProductVideo | undefined>(product?.video);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || []
  );
  const [currentStep, setCurrentStep] = useState(1);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const uploadImagesMutation = useUploadImages();
  const uploadVideoMutation = useUploadVideo();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      category: product?.category || "",
      subcategory: product?.subcategory || "",
      basePrice: product?.basePrice || 0,
      salePrice: product?.salePrice || undefined,
      tags: product?.tags || [],
      brand: product?.brand || "",
      weight: product?.weight || undefined,
      dimensions: product?.dimensions || undefined,
      status: product?.status || "draft",
    },
  });

  const watchedPrice = watch("basePrice");

  // Update variant prices when base price changes
  useEffect(() => {
    if (watchedPrice && variants.length === 0) {
      // Only set default variant if no variants exist
      const defaultVariant: ProductVariant = {
        id: "default",
        price: watchedPrice,
        stock: 0,
        isActive: true,
      };
      setVariants([defaultVariant]);
    }
  }, [watchedPrice, variants.length]);

  const handleFormSubmit = async (data: ProductFormData) => {
    // Validate required fields
    if (images.length === 0) {
      Alert.alert("Error", "At least one product image is required");
      return;
    }

    if (variants.length === 0) {
      Alert.alert("Error", "At least one product variant is required");
      return;
    }

    try {
      let productId: string;

      if (isEditing && product?._id) {
        // Update existing product
        const response = await updateProductMutation.mutateAsync({
          id: product._id,
          data,
        });
        productId = response.data._id!;
      } else {
        // Create new product
        const response = await createProductMutation.mutateAsync(data);
        productId = response.data._id!;
      }

      // Upload images if there are new ones
      const newImages = images.filter((img) => img.id.startsWith("temp_"));
      if (newImages.length > 0) {
        const imageFiles = newImages.map((img) => ({
          uri: img.uri,
          type: "image/jpeg",
          name: `image_${Date.now()}.jpg`,
        }));
        await uploadImagesMutation.mutateAsync({
          productId,
          images: imageFiles,
        });
      }

      // Upload video if there's a new one
      if (video && video.id.startsWith("temp_")) {
        const videoFile = {
          uri: video.uri,
          type: "video/mp4",
          name: `video_${Date.now()}.mp4`,
        };
        await uploadVideoMutation.mutateAsync({
          productId,
          video: videoFile,
        });
      }

      Alert.alert(
        "Success",
        `Product ${isEditing ? "updated" : "created"} successfully!`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProductFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["title", "description", "category", "basePrice"];
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
      { number: 1, title: "Basic Info", icon: "information-circle-outline" },
      { number: 2, title: "Media", icon: "camera-outline" },
      { number: 3, title: "Variants", icon: "cube-outline" },
      { number: 4, title: "Review", icon: "checkmark-circle-outline" },
    ];

    return (
      <View className="mb-6">
        <View className="flex-row justify-between items-center">
          {steps.map((step, index) => (
            <View key={step.number} className="flex items-center">
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
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    step.number < currentStep ? "bg-purple-600" : "bg-gray-400"
                  }`}
                  style={{ transform: [{ translateX: "50%" }] }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderBasicInfoStep = () => (
    <View className="space-y-4">
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Basic Information
      </Text>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Product Title"
            placeholder="Enter product title"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.title?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTextArea
            label="Description"
            placeholder="Describe your product in detail"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            rows={4}
            maxLength={2000}
            showCharCount
            error={errors.description?.message}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <FormSelect
            label="Category"
            placeholder="Select category"
            value={value}
            onValueChange={onChange}
            options={PRODUCT_CATEGORIES.map((cat) => ({
              label: cat,
              value: cat,
            }))}
            error={errors.category?.message}
            required
            searchable
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Brand (Optional)"
            placeholder="Enter brand name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.brand?.message}
          />
        )}
      />

      <View className="flex-row space-x-3">
        <Controller
          control={control}
          name="basePrice"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Base Price"
              placeholder="0.00"
              value={value?.toString()}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              onBlur={onBlur}
              keyboardType="numeric"
              leftIcon={
                <Text className="text-gray-500 font-rubik-medium">$</Text>
              }
              error={errors.basePrice?.message}
              className="flex-1"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="salePrice"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Sale Price (Optional)"
              placeholder="0.00"
              value={value?.toString() || ""}
              onChangeText={(text) =>
                onChange(text ? parseFloat(text) : undefined)
              }
              onBlur={onBlur}
              keyboardType="numeric"
              leftIcon={
                <Text className="text-gray-500 font-rubik-medium">$</Text>
              }
              error={errors.salePrice?.message}
              className="flex-1"
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <FormSelect
            label="Status"
            placeholder="Select status"
            value={value}
            onValueChange={onChange}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
              { label: "Hidden", value: "hidden" },
            ]}
            error={errors.status?.message}
            required
          />
        )}
      />
    </View>
  );

  const renderMediaStep = () => (
    <View>
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Product Media
      </Text>

      <ImageUpload
        images={images}
        onImagesChange={setImages}
        maxImages={10}
        isUploading={uploadImagesMutation.isPending}
      />

      <VideoUpload
        video={video}
        onVideoChange={setVideo}
        isUploading={uploadVideoMutation.isPending}
      />
    </View>
  );

  const renderVariantsStep = () => (
    <View>
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Product Variants
      </Text>

      <VariantManager
        variants={variants}
        onVariantsChange={setVariants}
        basePrice={watchedPrice || 0}
      />
    </View>
  );

  const renderReviewStep = () => (
    <View>
      <Text className="text-2xl font-rubik-bold text-gray-900 mb-4">
        Review & Submit
      </Text>

      <View className="space-y-4">
        <View className="p-4 bg-gray-50 rounded-lg">
          <Text className="font-rubik-semibold text-gray-900 mb-2">
            Product Summary
          </Text>
          <Text className="text-gray-700 font-rubik-regular">
            Title: {watch("title") || "Not set"}
          </Text>
          <Text className="text-gray-700 font-rubik-regular">
            Category: {watch("category") || "Not set"}
          </Text>
          <Text className="text-gray-700 font-rubik-regular">
            Base Price: ${watch("basePrice")?.toFixed(2) || "0.00"}
          </Text>
          <Text className="text-gray-700 font-rubik-regular">
            Images: {images.length}
          </Text>
          <Text className="text-gray-700 font-rubik-regular">
            Video: {video ? "Yes" : "No"}
          </Text>
          <Text className="text-gray-700 font-rubik-regular">
            Variants: {variants.length}
          </Text>
        </View>

        <View className="p-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 font-rubik-medium mb-1">
            Ready to {isEditing ? "update" : "create"} product?
          </Text>
          <Text className="text-blue-700 font-rubik-regular text-sm">
            Review all information above before submitting.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-8">
            {renderStepIndicator()}

            {currentStep === 1 && renderBasicInfoStep()}
            {currentStep === 2 && renderMediaStep()}
            {currentStep === 3 && renderVariantsStep()}
            {currentStep === 4 && renderReviewStep()}

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

              {currentStep < 4 ? (
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
                  title={isEditing ? "Update Product" : "Create Product"}
                  onPress={handleSubmit(handleFormSubmit)}
                  loading={
                    createProductMutation.isPending ||
                    updateProductMutation.isPending ||
                    uploadImagesMutation.isPending ||
                    uploadVideoMutation.isPending
                  }
                  variant="primary"
                  size="lg"
                  className={currentStep === 1 ? "flex-1" : "flex-1 ml-2"}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

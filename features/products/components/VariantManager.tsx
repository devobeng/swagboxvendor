import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { FormInput, FormButton, FormSelect } from "../../../components/ui";
import {
  ProductVariant,
  PRODUCT_SIZES,
  PRODUCT_COLORS,
  PRODUCT_MATERIALS,
} from "../types";
import {
  variantFormSchema,
  ProductVariantFormData,
} from "../validations/productSchemas";

interface VariantManagerProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  basePrice: number;
}

export const VariantManager: React.FC<VariantManagerProps> = ({
  variants,
  onVariantsChange,
  basePrice,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductVariantFormData>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      size: "",
      color: "",
      material: "",
      sku: "",
      price: basePrice,
      salePrice: undefined,
      stock: 0,
    },
  });

  const handleAddVariant = (data: ProductVariantFormData) => {
    const newVariant: ProductVariant = {
      id: `variant_${Date.now()}`,
      size: data.size || undefined,
      color: data.color || undefined,
      material: data.material || undefined,
      sku: data.sku || undefined,
      price: data.price,
      salePrice: data.salePrice || undefined,
      stock: data.stock,
      isActive: true,
    };

    onVariantsChange([...variants, newVariant]);
    setShowAddModal(false);
    reset();
  };

  const handleEditVariant = (data: ProductVariantFormData) => {
    if (!editingVariant) return;

    const updatedVariants = variants.map((variant) =>
      variant.id === editingVariant.id
        ? {
            ...variant,
            size: data.size || undefined,
            color: data.color || undefined,
            material: data.material || undefined,
            sku: data.sku || undefined,
            price: data.price,
            salePrice: data.salePrice || undefined,
            stock: data.stock,
          }
        : variant
    );

    onVariantsChange(updatedVariants);
    setEditingVariant(null);
    reset();
  };

  const handleDeleteVariant = (variantId: string) => {
    Alert.alert(
      "Delete Variant",
      "Are you sure you want to delete this variant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedVariants = variants.filter((v) => v.id !== variantId);
            onVariantsChange(updatedVariants);
          },
        },
      ]
    );
  };

  const handleToggleVariantStatus = (variantId: string) => {
    const updatedVariants = variants.map((variant) =>
      variant.id === variantId
        ? { ...variant, isActive: !variant.isActive }
        : variant
    );
    onVariantsChange(updatedVariants);
  };

  const openEditModal = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setValue("size", variant.size || "");
    setValue("color", variant.color || "");
    setValue("material", variant.material || "");
    setValue("sku", variant.sku || "");
    setValue("price", variant.price);
    setValue("salePrice", variant.salePrice);
    setValue("stock", variant.stock);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingVariant(null);
    reset();
  };

  const renderVariantCard = (variant: ProductVariant) => (
    <View
      key={variant.id}
      className={`p-4 rounded-lg border mb-3 ${
        variant.isActive
          ? "border-gray-200 bg-white"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <View className="flex-row flex-wrap">
            {variant.size && (
              <View className="bg-purple-100 px-2 py-1 rounded mr-2 mb-1">
                <Text className="text-purple-700 text-xs font-rubik-medium">
                  Size: {variant.size}
                </Text>
              </View>
            )}
            {variant.color && (
              <View className="bg-blue-100 px-2 py-1 rounded mr-2 mb-1">
                <Text className="text-blue-700 text-xs font-rubik-medium">
                  Color: {variant.color}
                </Text>
              </View>
            )}
            {variant.material && (
              <View className="bg-green-100 px-2 py-1 rounded mr-2 mb-1">
                <Text className="text-green-700 text-xs font-rubik-medium">
                  Material: {variant.material}
                </Text>
              </View>
            )}
          </View>

          {variant.sku && (
            <Text className="text-gray-600 text-sm font-rubik-regular mt-1">
              SKU: {variant.sku}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className={`px-2 py-1 rounded ${
            variant.isActive ? "bg-green-100" : "bg-gray-200"
          }`}
          onPress={() => handleToggleVariantStatus(variant.id)}
        >
          <Text
            className={`text-xs font-rubik-medium ${
              variant.isActive ? "text-green-700" : "text-gray-600"
            }`}
          >
            {variant.isActive ? "Active" : "Inactive"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row space-x-4">
          <View>
            <Text className="text-gray-500 text-xs font-rubik-regular">
              Price
            </Text>
            <Text className="text-gray-900 font-rubik-semibold">
              ${variant.price.toFixed(2)}
            </Text>
            {variant.salePrice && (
              <Text className="text-red-600 font-rubik-semibold">
                Sale: ${variant.salePrice.toFixed(2)}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-gray-500 text-xs font-rubik-regular">
              Stock
            </Text>
            <Text
              className={`font-rubik-semibold ${
                variant.stock === 0
                  ? "text-red-600"
                  : variant.stock < 10
                    ? "text-orange-600"
                    : "text-green-600"
              }`}
            >
              {variant.stock}
            </Text>
          </View>
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="p-2 bg-purple-100 rounded"
            onPress={() => openEditModal(variant)}
          >
            <Ionicons name="pencil" size={16} color="#9333EA" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 bg-red-100 rounded"
            onPress={() => handleDeleteVariant(variant.id)}
          >
            <Ionicons name="trash" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderVariantForm = () => (
    <ScrollView className="flex-1 p-6">
      <Text className="text-xl font-rubik-bold text-gray-900 mb-6">
        {editingVariant ? "Edit Variant" : "Add New Variant"}
      </Text>

      <View className="space-y-4">
        <Controller
          control={control}
          name="size"
          render={({ field: { onChange, value } }) => (
            <FormSelect
              label="Size (Optional)"
              placeholder="Select size"
              value={value}
              onValueChange={onChange}
              options={PRODUCT_SIZES.map((size) => ({
                label: size,
                value: size,
              }))}
              error={errors.size?.message}
              searchable
            />
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, value } }) => (
            <FormSelect
              label="Color (Optional)"
              placeholder="Select color"
              value={value}
              onValueChange={onChange}
              options={PRODUCT_COLORS.map((color) => ({
                label: color,
                value: color,
              }))}
              error={errors.color?.message}
              searchable
            />
          )}
        />

        <Controller
          control={control}
          name="material"
          render={({ field: { onChange, value } }) => (
            <FormSelect
              label="Material (Optional)"
              placeholder="Select material"
              value={value}
              onValueChange={onChange}
              options={PRODUCT_MATERIALS.map((material) => ({
                label: material,
                value: material,
              }))}
              error={errors.material?.message}
              searchable
            />
          )}
        />

        <Controller
          control={control}
          name="sku"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="SKU (Optional)"
              placeholder="Enter SKU"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.sku?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Price"
              placeholder="0.00"
              value={value?.toString()}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              onBlur={onBlur}
              keyboardType="numeric"
              leftIcon={
                <Text className="text-gray-500 font-rubik-medium">$</Text>
              }
              error={errors.price?.message}
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
            />
          )}
        />

        <Controller
          control={control}
          name="stock"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Stock Quantity"
              placeholder="0"
              value={value?.toString()}
              onChangeText={(text) => onChange(parseInt(text) || 0)}
              onBlur={onBlur}
              keyboardType="numeric"
              error={errors.stock?.message}
              required
            />
          )}
        />
      </View>

      <View className="flex-row space-x-3 mt-6">
        <FormButton
          title="Cancel"
          variant="outline"
          size="lg"
          className="flex-1"
          onPress={closeModal}
        />

        <FormButton
          title={editingVariant ? "Update" : "Add"}
          variant="primary"
          size="lg"
          className="flex-1"
          onPress={handleSubmit(
            editingVariant ? handleEditVariant : handleAddVariant
          )}
        />
      </View>
    </ScrollView>
  );

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-rubik-semibold text-gray-900">
          Product Variants ({variants.length})
        </Text>

        <TouchableOpacity
          className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={16} color="white" />
          <Text className="text-white font-rubik-medium ml-1">Add Variant</Text>
        </TouchableOpacity>
      </View>

      {variants.length === 0 ? (
        <View className="p-6 border-2 border-dashed border-gray-300 rounded-lg items-center">
          <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 font-rubik-medium mt-2">
            No variants added
          </Text>
          <Text className="text-gray-400 font-rubik-regular text-sm text-center mt-1">
            Add variants to offer different sizes, colors, or materials
          </Text>
        </View>
      ) : (
        <ScrollView className="max-h-96">
          {variants.map(renderVariantCard)}
        </ScrollView>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal || editingVariant !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">{renderVariantForm()}</View>
      </Modal>
    </View>
  );
};

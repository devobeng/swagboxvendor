import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  searchable?: boolean;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  error,
  helperText,
  required = false,
  disabled = false,
  variant = "default",
  size = "md",
  searchable = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const getContainerStyles = () => {
    const baseStyles = "flex-row items-center justify-between rounded-xl";
    const sizeStyles = {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-5 py-4",
    };
    const variantStyles = {
      default: "border border-gray-300 bg-white",
      outline: "border-2 border-gray-300 bg-transparent",
      filled: "bg-gray-100 border-0",
    };
    const stateStyles = error
      ? "border-red-500"
      : disabled
        ? "bg-gray-100 border-gray-200"
        : "focus:border-blue-500";

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${stateStyles}`;
  };

  const getTextStyles = () => {
    const baseStyles = "font-rubik-regular";
    const sizeStyles = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    const colorStyles = selectedOption ? "text-gray-900" : "text-gray-500";

    return `${baseStyles} ${sizeStyles[size]} ${colorStyles}`;
  };

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      className={`p-4 border-b border-gray-100 ${
        item.value === value ? "bg-blue-50" : "bg-white"
      }`}
      onPress={() => handleSelect(item.value)}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`font-rubik-regular text-base ${
            item.value === value ? "text-blue-600" : "text-gray-900"
          }`}
        >
          {item.label}
        </Text>
        {item.value === value && (
          <Ionicons name="checkmark" size={20} color="#2563EB" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <View className="flex-row items-center mb-2">
          <Text className="text-sm font-rubik-medium text-gray-700">
            {label}
            {required && <Text className="text-red-500 ml-1">*</Text>}
          </Text>
        </View>
      )}

      {/* Select Trigger */}
      <TouchableOpacity
        className={getContainerStyles()}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text className={getTextStyles()}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View className="flex-row items-center mt-1">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-red-500 font-rubik-regular text-sm ml-1">
            {error}
          </Text>
        </View>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text className="text-gray-500 font-rubik-regular text-sm mt-1">
          {helperText}
        </Text>
      )}

      {/* Options Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-rubik-semibold text-gray-900">
              {label || "Select Option"}
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)} className="p-2">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search Input (if searchable) */}
          {searchable && (
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                <Ionicons name="search" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 font-rubik-regular text-base text-gray-900"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}

          {/* Options List */}
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={renderOption}
            className="flex-1"
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

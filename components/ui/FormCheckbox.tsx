import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "danger";
  className?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked,
  onValueChange,
  error,
  helperText,
  disabled = false,
  size = "md",
  variant = "default",
  className = "",
}) => {
  const getCheckboxStyles = () => {
    const baseStyles = "rounded border-2 items-center justify-center";

    const sizeStyles = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const variantStyles = {
      default: checked
        ? "bg-blue-600 border-blue-600"
        : "bg-white border-gray-300",
      primary: checked
        ? "bg-blue-600 border-blue-600"
        : "bg-white border-gray-300",
      success: checked
        ? "bg-green-600 border-green-600"
        : "bg-white border-gray-300",
      danger: checked
        ? "bg-red-600 border-red-600"
        : "bg-white border-gray-300",
    };

    const stateStyles = error
      ? "border-red-500"
      : disabled
        ? "bg-gray-100 border-gray-200"
        : "";

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${stateStyles}`;
  };

  const getLabelStyles = () => {
    const baseStyles = "font-rubik-regular flex-1";
    const sizeStyles = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };
    const stateStyles = disabled ? "text-gray-400" : "text-gray-900";

    return `${baseStyles} ${sizeStyles[size]} ${stateStyles}`;
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 12;
      case "md":
        return 14;
      case "lg":
        return 16;
      default:
        return 14;
    }
  };

  return (
    <View className={`mb-4 ${className}`}>
      <TouchableOpacity
        className="flex-row items-start"
        onPress={() => !disabled && onValueChange(!checked)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <View className={getCheckboxStyles()}>
          {checked && (
            <Ionicons name="checkmark" size={getIconSize()} color="white" />
          )}
        </View>

        {/* Label */}
        <Text className={`${getLabelStyles()} ml-3`}>{label}</Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View className="flex-row items-center mt-1 ml-8">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="text-red-500 font-rubik-regular text-sm ml-1">
            {error}
          </Text>
        </View>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text className="text-gray-500 font-rubik-regular text-sm mt-1 ml-8">
          {helperText}
        </Text>
      )}
    </View>
  );
};

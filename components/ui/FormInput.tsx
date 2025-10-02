import React, { forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onRightIconPress?: () => void;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required = false,
      variant = "default",
      size = "md",
      disabled = false,
      onRightIconPress,
      className = "",
      ...props
    },
    ref
  ) => {
    const getContainerStyles = () => {
      const baseStyles = "relative flex-row items-center rounded-xl";
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
      const baseStyles = "flex-1 font-rubik-regular text-gray-900";
      const sizeStyles = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      };
      const stateStyles = disabled ? "text-gray-400" : "text-gray-900";

      return `${baseStyles} ${sizeStyles[size]} ${stateStyles}`;
    };

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

        {/* Input Container */}
        <View className={getContainerStyles()}>
          {/* Left Icon */}
          {leftIcon && <View className="mr-3">{leftIcon}</View>}

          {/* Text Input */}
          <TextInput
            ref={ref}
            className={getTextStyles()}
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              className="ml-3"
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

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
      </View>
    );
  }
);

FormInput.displayName = "FormInput";

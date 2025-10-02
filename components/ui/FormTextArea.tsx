import React, { forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FormTextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: "default" | "outline" | "filled";
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export const FormTextArea = forwardRef<TextInput, FormTextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      variant = "default",
      disabled = false,
      rows = 4,
      maxLength,
      showCharCount = false,
      value = "",
      className = "",
      ...props
    },
    ref
  ) => {
    const getContainerStyles = () => {
      const baseStyles = "rounded-xl p-4";
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

      return `${baseStyles} ${variantStyles[variant]} ${stateStyles}`;
    };

    const getTextStyles = () => {
      const baseStyles = "font-rubik-regular text-base";
      const stateStyles = disabled ? "text-gray-400" : "text-gray-900";
      const heightStyles = `min-h-[${rows * 24}px]`;

      return `${baseStyles} ${stateStyles} ${heightStyles}`;
    };

    const characterCount = value?.toString().length || 0;

    return (
      <View className={`mb-4 ${className}`}>
        {/* Label */}
        {label && (
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-rubik-medium text-gray-700">
              {label}
              {required && <Text className="text-red-500 ml-1">*</Text>}
            </Text>
            {showCharCount && maxLength && (
              <Text className="text-xs font-rubik-regular text-gray-500">
                {characterCount}/{maxLength}
              </Text>
            )}
          </View>
        )}

        {/* TextArea Container */}
        <View className={getContainerStyles()}>
          <TextInput
            ref={ref}
            className={getTextStyles()}
            multiline
            numberOfLines={rows}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
            maxLength={maxLength}
            value={value}
            {...props}
          />
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

        {/* Character Count (bottom) */}
        {showCharCount && maxLength && !error && !helperText && (
          <Text className="text-xs font-rubik-regular text-gray-400 mt-1 text-right">
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>
    );
  }
);

FormTextArea.displayName = "FormTextArea";

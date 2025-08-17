import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-rubik-medium text-sm mb-2">
          {label}
        </Text>
      )}

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            {leftIcon}
          </View>
        )}

        <TextInput
          className={[
            "border border-gray-300 rounded-xl px-4 py-3 font-rubik-regular text-gray-900",
            leftIcon && "pl-12",
            rightIcon && "pr-12",
            error ? "border-red-500" : "border-gray-300",
            "focus:border-purple-500",
            className,
          ].join(" ")}
          placeholderTextColor="#9CA3AF"
          {...props}
        />

        {rightIcon && (
          <View className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {rightIcon}
          </View>
        )}
      </View>

      {error && (
        <Text className="text-red-500 font-rubik-regular text-sm mt-1">
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text className="text-gray-500 font-rubik-regular text-sm mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};

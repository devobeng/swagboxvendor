import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FormButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  iconSize?: number;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  iconSize = 20,
  className = "",
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = "flex-row items-center justify-center rounded-xl";

    const sizeStyles = {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-6 py-4",
      xl: "px-8 py-5",
    };

    const variantStyles = {
      primary: "bg-purple-600 active:bg-purple-700",
      secondary: "bg-gray-600 active:bg-gray-700",
      outline: "bg-transparent border-2 border-purple-600 active:bg-purple-50",
      danger: "bg-red-600 active:bg-red-700",
      ghost: "bg-transparent active:bg-gray-100",
    };

    const stateStyles = disabled || loading ? "opacity-50" : "";

    const widthStyles = fullWidth ? "w-full" : "";

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${stateStyles} ${widthStyles}`;
  };

  const getTextStyles = () => {
    const baseStyles = "font-rubik-semibold text-center";

    const sizeStyles = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    };

    const variantStyles = {
      primary: "text-white",
      secondary: "text-white",
      outline: "text-purple-600",
      danger: "text-white",
      ghost: "text-gray-700",
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary":
      case "secondary":
      case "danger":
        return "#FFFFFF";
      case "outline":
        return "#9333EA";
      case "ghost":
        return "#374151";
      default:
        return "#FFFFFF";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-row items-center">
          <ActivityIndicator
            size="small"
            color={getIconColor()}
            className="mr-2"
          />
          <Text className={getTextStyles()}>Loading...</Text>
        </View>
      );
    }

    return (
      <View className="flex-row items-center">
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={iconSize}
            color={getIconColor()}
            className="mr-2"
          />
        )}

        <Text className={getTextStyles()}>{title}</Text>

        {rightIcon && (
          <Ionicons
            name={rightIcon as any}
            size={iconSize}
            color={getIconColor()}
            className="ml-2"
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      className={`${getButtonStyles()} ${className}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

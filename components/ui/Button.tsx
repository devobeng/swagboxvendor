import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles = "rounded-xl items-center justify-center";

  const variantStyles = {
    primary: "bg-purple-600",
    secondary: "bg-gray-200",
    outline: "bg-transparent border border-gray-300",
    danger: "bg-red-500",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-8 py-5",
  };

  const textStyles = {
    primary: "text-white font-rubik-semibold",
    secondary: "text-gray-800 font-rubik-medium",
    outline: "text-gray-700 font-rubik-medium",
    danger: "text-white font-rubik-semibold",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const buttonStyles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && "opacity-50",
    className,
  ].filter(Boolean);

  const textClassNames = [textStyles[variant], textSizeStyles[size]].join(" ");

  return (
    <TouchableOpacity
      className={buttonStyles.join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "danger" ? "white" : "#374151"
          }
          size="small"
        />
      ) : (
        <Text className={textClassNames}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

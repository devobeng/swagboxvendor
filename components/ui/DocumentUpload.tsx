import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface DocumentUploadProps {
  label: string;
  required?: boolean;
  documentType?: "image" | "document" | "both";
  maxSize?: number; // in MB
  allowedTypes?: string[];
  value?: any;
  onChange: (file: any) => void;
  error?: string;
  helperText?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  required = false,
  documentType = "both",
  maxSize = 10,
  allowedTypes = ["image/*", "application/pdf"],
  value,
  onChange,
  error,
  helperText,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];

        // Check file size
        if (file.size && file.size > maxSize * 1024 * 1024) {
          Alert.alert(
            "File too large",
            `File size must be less than ${maxSize}MB`
          );
          return;
        }

        onChange(file);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Create a file-like object for consistency
        const file = {
          uri: asset.uri,
          name: `image_${Date.now()}.jpg`,
          type: "image/jpeg",
          size: asset.fileSize || 0,
        };

        onChange(file);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePress = () => {
    if (documentType === "image") {
      pickImage();
    } else if (documentType === "document") {
      pickDocument();
    } else {
      // Show choice
      Alert.alert("Choose Upload Type", "What would you like to upload?", [
        { text: "Image", onPress: pickImage },
        { text: "Document", onPress: pickDocument },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const removeFile = () => {
    onChange(null);
  };

  const isImage =
    value?.type?.startsWith("image/") ||
    value?.uri?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-700 font-rubik-medium text-sm">{label}</Text>
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>

      {!value ? (
        <TouchableOpacity
          onPress={handlePress}
          disabled={isUploading}
          className={[
            "border-2 border-dashed border-gray-300 rounded-xl p-6 items-center justify-center",
            isUploading && "opacity-50",
          ].join(" ")}
        >
          {isUploading ? (
            <View className="items-center">
              <Ionicons name="cloud-upload" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 font-rubik-medium mt-2">
                Uploading...
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Ionicons name="cloud-upload" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 font-rubik-medium mt-2">
                Tap to upload{" "}
                {documentType === "image"
                  ? "image"
                  : documentType === "document"
                    ? "document"
                    : "file"}
              </Text>
              <Text className="text-gray-400 font-rubik-regular text-xs mt-1">
                Max size: {maxSize}MB
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View className="border border-gray-300 rounded-xl p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              {isImage ? (
                <Image
                  source={{ uri: value.uri }}
                  className="w-12 h-12 rounded-lg mr-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-12 h-12 bg-gray-100 rounded-lg mr-3 items-center justify-center">
                  <Ionicons name="document" size={24} color="#6B7280" />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-gray-900 font-rubik-medium text-sm">
                  {value.name || "Document"}
                </Text>
                <Text className="text-gray-500 font-rubik-regular text-xs">
                  {value.size
                    ? `${(value.size / 1024 / 1024).toFixed(2)} MB`
                    : "Unknown size"}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={removeFile} className="ml-3">
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

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

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePickerExpo from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

interface ImagePickerProps {
  label: string;
  description?: string;
  onImageSelected: (image: any) => void;
  image?: any;
  type?: "image" | "document";
  required?: boolean;
  className?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  description,
  onImageSelected,
  image,
  type = "image",
  required = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } =
      await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload images."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);

      if (type === "document") {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["image/*", "application/pdf"],
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets[0]) {
          const asset = result.assets[0];
          onImageSelected({
            uri: asset.uri,
            type: asset.mimeType,
            name: asset.name,
            size: asset.size,
          });
        }
      } else {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        Alert.alert("Select Image", "Choose an option", [
          { text: "Camera", onPress: openCamera },
          { text: "Gallery", onPress: openGallery },
          { text: "Cancel", style: "cancel" },
        ]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsLoading(false);
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera permissions.");
        return;
      }

      const result = await ImagePickerExpo.launchCameraAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onImageSelected({
          uri: asset.uri,
          type: "image/jpeg",
          name: `image_${Date.now()}.jpg`,
        });
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        onImageSelected({
          uri: asset.uri,
          type: "image/jpeg",
          name: `image_${Date.now()}.jpg`,
        });
      }
    } catch (error) {
      console.error("Error opening gallery:", error);
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const removeImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => onImageSelected(null),
      },
    ]);
  };

  return (
    <View className={`mb-4 ${className}`}>
      {/* Label */}
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      </View>

      {/* Description */}
      {description && (
        <Text className="text-sm text-gray-500 mb-3">{description}</Text>
      )}

      {/* Image Preview or Upload Area */}
      {image ? (
        <View className="relative">
          {image.uri &&
          (image.type?.startsWith("image/") || type === "image") ? (
            <Image
              source={{ uri: image.uri }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-48 bg-gray-100 rounded-lg items-center justify-center">
              <Ionicons name="document-outline" size={48} color="#6B7280" />
              <Text className="text-gray-600 mt-2 text-center">
                {image.name || "Document Selected"}
              </Text>
            </View>
          )}

          {/* Remove Button */}
          <TouchableOpacity
            onPress={removeImage}
            className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
          >
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>

          {/* Change Button */}
          <TouchableOpacity
            onPress={pickImage}
            disabled={isLoading}
            className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2"
          >
            <Ionicons name="camera-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          disabled={isLoading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#3B82F6" />
          ) : (
            <>
              <Ionicons
                name={
                  type === "document" ? "document-outline" : "camera-outline"
                }
                size={48}
                color="#6B7280"
              />
              <Text className="text-gray-600 mt-2 font-medium">
                {type === "document" ? "Select Document" : "Add Image"}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {type === "document"
                  ? "PDF or Image files"
                  : "Camera or Gallery"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

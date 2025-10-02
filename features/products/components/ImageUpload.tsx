import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import { useImagePicker } from "../hooks/useProductMedia";
import { ProductImage } from "../types";

interface ImageUploadProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
  isUploading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  isUploading = false,
}) => {
  const { pickFromCamera, pickFromGallery } = useImagePicker();
  const [dragEnabled, setDragEnabled] = useState(false);

  const handleAddImages = () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxImages} images`
      );
      return;
    }

    Alert.alert("Add Images", "Choose how you want to add images", [
      {
        text: "Camera",
        onPress: async () => {
          const image = await pickFromCamera();
          if (image) {
            const newImage: ProductImage = {
              id: `temp_${Date.now()}`,
              uri: image.uri,
              order: images.length,
            };
            onImagesChange([...images, newImage]);
          }
        },
      },
      {
        text: "Gallery (Multiple)",
        onPress: async () => {
          const selectedImages = await pickFromGallery(true);
          if (selectedImages && Array.isArray(selectedImages)) {
            const remainingSlots = maxImages - images.length;
            const imagesToAdd = selectedImages.slice(0, remainingSlots);

            const newImages: ProductImage[] = imagesToAdd.map((img, index) => ({
              id: `temp_${Date.now()}_${index}`,
              uri: img.uri,
              order: images.length + index,
            }));

            onImagesChange([...images, ...newImages]);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveImage = (imageId: string) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const updatedImages = images
            .filter((img) => img.id !== imageId)
            .map((img, index) => ({ ...img, order: index }));
          onImagesChange(updatedImages);
        },
      },
    ]);
  };

  const handleSetMainImage = (imageId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isMain: img.id === imageId,
    }));
    onImagesChange(updatedImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(fromIndex, 1);
    reorderedImages.splice(toIndex, 0, movedImage);

    // Update order values
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    onImagesChange(updatedImages);
  };

  const renderImageItem = (item: ProductImage, index: number) => (
    <View className="relative mr-3 mb-3">
      <View className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
        <Image
          source={{ uri: item.uri }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Main image indicator */}
        {item.isMain && (
          <View className="absolute top-1 left-1 bg-purple-600 rounded-full px-2 py-1">
            <Text className="text-white text-xs font-rubik-medium">Main</Text>
          </View>
        )}

        {/* Reorder buttons */}
        {dragEnabled && index > 0 && (
          <TouchableOpacity
            className="absolute top-1 left-1 bg-black/50 rounded-full p-1"
            onPress={() => handleReorder(index, index - 1)}
          >
            <Ionicons name="chevron-up" size={12} color="white" />
          </TouchableOpacity>
        )}
        {dragEnabled && index < images.length - 1 && (
          <TouchableOpacity
            className="absolute bottom-1 left-1 bg-black/50 rounded-full p-1"
            onPress={() => handleReorder(index, index + 1)}
          >
            <Ionicons name="chevron-down" size={12} color="white" />
          </TouchableOpacity>
        )}

        {/* Remove button */}
        <TouchableOpacity
          className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
          onPress={() => handleRemoveImage(item.id)}
          style={{ display: dragEnabled ? "none" : "flex" }}
        >
          <Ionicons name="close" size={12} color="white" />
        </TouchableOpacity>
      </View>

      {/* Set as main button */}
      {!item.isMain && !dragEnabled && (
        <TouchableOpacity
          className="absolute bottom-1 left-1 bg-purple-600 rounded px-2 py-1"
          onPress={() => handleSetMainImage(item.id)}
        >
          <Text className="text-white text-xs font-rubik-medium">Set Main</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-rubik-semibold text-gray-900">
          Product Images ({images.length}/{maxImages})
        </Text>

        {images.length > 1 && (
          <TouchableOpacity
            className={`px-3 py-1 rounded-full ${
              dragEnabled ? "bg-purple-600" : "bg-gray-200"
            }`}
            onPress={() => setDragEnabled(!dragEnabled)}
          >
            <Text
              className={`text-sm font-rubik-medium ${
                dragEnabled ? "text-white" : "text-gray-700"
              }`}
            >
              {dragEnabled ? "Done" : "Reorder"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {/* Add image button */}
          <TouchableOpacity
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 items-center justify-center mr-3 mb-3"
            onPress={handleAddImages}
            disabled={isUploading || images.length >= maxImages}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#9333EA" />
            ) : (
              <>
                <Ionicons name="camera" size={24} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 font-rubik-medium mt-1">
                  Add Photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Image list */}
          {images.map((image, index) => (
            <View key={image.id}>{renderImageItem(image, index)}</View>
          ))}
        </View>
      </ScrollView>

      {/* Helper text */}
      <Text className="text-sm text-gray-500 font-rubik-regular mt-2">
        Tap the camera icon to add photos. Set one image as main. Drag to
        reorder.
      </Text>

      {images.length === 0 && (
        <Text className="text-sm text-red-500 font-rubik-regular mt-1">
          At least one product image is required
        </Text>
      )}
    </View>
  );
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { ProductService } from "../services/productService";
import { productKeys } from "./useProducts";

// Upload product images
export const useUploadImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, images }: { productId: string; images: any[] }) =>
      ProductService.uploadImages(productId, images),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      Alert.alert(
        "Success",
        response.message || "Images uploaded successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload images"
      );
    },
  });
};

// Reorder product images
export const useReorderImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageOrders,
    }: {
      productId: string;
      imageOrders: Array<{ id: string; order: number }>;
    }) => ProductService.reorderImages(productId, imageOrders),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      Alert.alert(
        "Success",
        response.message || "Images reordered successfully"
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reorder images"
      );
    },
  });
};

// Delete product image
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => ProductService.deleteImage(productId, imageId),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      Alert.alert("Success", response.message || "Image deleted successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete image"
      );
    },
  });
};

// Upload product video
export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, video }: { productId: string; video: any }) =>
      ProductService.uploadVideo(productId, video),
    onSuccess: (response, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      Alert.alert("Success", response.message || "Video uploaded successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload video"
      );
    },
  });
};

// Delete product video
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => ProductService.deleteVideo(productId),
    onSuccess: (response, productId) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId),
      });
      Alert.alert("Success", response.message || "Video deleted successfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to delete video"
      );
    },
  });
};

// Custom hook for image picker functionality
export const useImagePicker = () => {
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Camera and photo library permissions are required to upload images."
      );
      return false;
    }
    return true;
  };

  const pickFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `image_${Date.now()}.jpg`,
        };
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
    return null;
  };

  const pickFromGallery = async (multiple = false) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: !multiple,
        aspect: multiple ? undefined : [1, 1],
        quality: 0.8,
        allowsMultipleSelection: multiple,
        selectionLimit: multiple ? 10 : 1,
      });

      if (!result.canceled) {
        if (multiple) {
          return result.assets.map((asset, index) => ({
            uri: asset.uri,
            type: "image/jpeg",
            name: `image_${Date.now()}_${index}.jpg`,
          }));
        } else {
          return {
            uri: result.assets[0].uri,
            type: "image/jpeg",
            name: `image_${Date.now()}.jpg`,
          };
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
    return null;
  };

  const showImagePicker = (multiple = false) => {
    Alert.alert("Select Image", "Choose how you want to add images", [
      { text: "Camera", onPress: () => pickFromCamera() },
      { text: "Gallery", onPress: () => pickFromGallery(multiple) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return {
    pickFromCamera,
    pickFromGallery,
    showImagePicker,
  };
};

// Custom hook for video picker functionality
export const useVideoPicker = () => {
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Camera and photo library permissions are required to upload videos."
      );
      return false;
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          type: "video/mp4",
          name: `video_${Date.now()}.mp4`,
        };
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video");
    }
    return null;
  };

  const recordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          type: "video/mp4",
          name: `video_${Date.now()}.mp4`,
        };
      }
    } catch (error) {
      Alert.alert("Error", "Failed to record video");
    }
    return null;
  };

  const showVideoPicker = () => {
    Alert.alert("Select Video", "Choose how you want to add a video", [
      { text: "Record", onPress: () => recordVideo() },
      { text: "Gallery", onPress: () => pickVideo() },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return {
    pickVideo,
    recordVideo,
    showVideoPicker,
  };
};

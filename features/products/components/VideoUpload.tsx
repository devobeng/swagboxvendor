import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
// import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPicker } from "../hooks/useProductMedia";
import { ProductVideo } from "../types";

interface VideoUploadProps {
  video?: ProductVideo;
  onVideoChange: (video: ProductVideo | undefined) => void;
  isUploading?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  onVideoChange,
  isUploading = false,
}) => {
  const { pickVideo, recordVideo } = useVideoPicker();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddVideo = () => {
    Alert.alert("Add Product Video", "Choose how you want to add a video", [
      {
        text: "Record Video",
        onPress: async () => {
          const recordedVideo = await recordVideo();
          if (recordedVideo) {
            const newVideo: ProductVideo = {
              id: `temp_${Date.now()}`,
              uri: recordedVideo.uri,
            };
            onVideoChange(newVideo);
          }
        },
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const selectedVideo = await pickVideo();
          if (selectedVideo) {
            const newVideo: ProductVideo = {
              id: `temp_${Date.now()}`,
              uri: selectedVideo.uri,
            };
            onVideoChange(newVideo);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveVideo = () => {
    Alert.alert("Remove Video", "Are you sure you want to remove this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => onVideoChange(undefined),
      },
    ]);
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-rubik-semibold text-gray-900 mb-4">
        Product Video (Optional)
      </Text>

      {video ? (
        <View className="relative">
          <View className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 items-center justify-center">
            <Ionicons name="videocam" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 font-rubik-medium mt-2">
              Video Preview
            </Text>
            <Text className="text-gray-400 font-rubik-regular text-sm">
              {video.uri.split("/").pop()}
            </Text>
          </View>

          {/* Remove button */}
          <TouchableOpacity
            className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
            onPress={handleRemoveVideo}
          >
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 items-center justify-center"
          onPress={handleAddVideo}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color="#9333EA" />
          ) : (
            <>
              <Ionicons name="videocam" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 font-rubik-medium mt-2">
                Add Product Video
              </Text>
              <Text className="text-gray-400 font-rubik-regular text-sm mt-1">
                Show your product in action
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Helper text */}
      <Text className="text-sm text-gray-500 font-rubik-regular mt-2">
        Add a video to showcase your product features, unboxing, or demo. Max 60
        seconds.
      </Text>
    </View>
  );
};

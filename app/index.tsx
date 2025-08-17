import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../store/authStore";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000); // 5 seconds timeout

    if (!isLoading) {
      clearTimeout(timeout);
      if (isAuthenticated) {
        router.replace("/(dashboard)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, router]);

  const handleManualNavigation = () => {
    if (isAuthenticated) {
      router.replace("/(dashboard)/home");
    } else {
      router.replace("/(auth)/login");
    }
  };

  if (timeoutReached) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-2xl font-rubik-bold text-purple-600 mb-4">
          SwagBox Vendor
        </Text>
        <Text className="text-gray-600 font-rubik-medium text-center mb-6">
          Loading is taking longer than expected. You can manually proceed to
          the app.
        </Text>
        <TouchableOpacity
          onPress={handleManualNavigation}
          className="bg-purple-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-rubik-semibold">
            Continue to App
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-rubik-bold text-purple-600 mb-4">
        SwagBox Vendor
      </Text>
      <ActivityIndicator size="large" color="#9333EA" />
      <Text className="text-gray-600 font-rubik-medium mt-4">Loading...</Text>
    </View>
  );
}

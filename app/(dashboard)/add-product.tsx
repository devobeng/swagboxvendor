import React from "react";
import { View } from "react-native";
import { ProductForm } from "../../features/products";

export default function AddProductScreen() {
  return (
    <View className="flex-1">
      <ProductForm />
    </View>
  );
}

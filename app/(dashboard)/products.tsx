import React from "react";
import { View } from "react-native";
import { ProductList } from "../../features/products";

export default function ProductsScreen() {
  return (
    <View className="flex-1">
      <ProductList viewMode="grid" />
    </View>
  );
}

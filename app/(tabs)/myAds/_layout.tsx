import { useIsFocused } from "@react-navigation/native";
import { Stack, useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const MyAdsLayout = () => {
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      router.push("/(tabs)/myAds");
    }
  }, [isFocused]);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="editProduct/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default MyAdsLayout;

import { Stack } from "expo-router";
import React from "react";

const SellLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default SellLayout;

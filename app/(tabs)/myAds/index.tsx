import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "@/store/hooks";
import NotLoggedIn from "@/components/NotLoggedIn";

const MyAdsScreen: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);

  if (!token) {
    return <NotLoggedIn />;
  }

  return (
    <View style={styles.container}>
      <Text>My Ads Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyAdsScreen;

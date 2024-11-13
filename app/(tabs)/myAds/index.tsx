import { View, Text, StyleSheet } from "react-native";

export default function MyAdsScreen() {
  return (
    <View style={styles.container}>
      <Text>My Ads Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

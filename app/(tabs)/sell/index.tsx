import NotLoggedIn from "@/components/NotLoggedIn";
import { useAppSelector } from "@/store/hooks";
import { View, Text, StyleSheet } from "react-native";

export default function SellScreen() {
  const token = useAppSelector((state) => state.token.token);

  if (!token) {
    return <NotLoggedIn />;
  }

  return (
    <View style={styles.container}>
      <Text>Sell Screen</Text>
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

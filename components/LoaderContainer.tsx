import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LoaderContainer = () => {
  return (
    <View style={styles.loaderContainer}>
      <LottieView
        source={require("@/assets/lottie/loading.json")}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
    </View>
  );
};

export default LoaderContainer;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
});

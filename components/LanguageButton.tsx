import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const LanguageButton = ({ onPress }: { onPress: () => void }) => {
  const { i18n } = useTranslation();
  const [scaleAnimation] = useState(new Animated.Value(1));

  const getLanguageEmoji = () => {
    switch (i18n.language) {
      case "en":
        return "🇬🇧";
      case "hi":
        return "🇮🇳";
      case "gu":
        return "🇮🇳";
      default:
        return "🌐";
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
    ]).start();
    onPress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: scaleAnimation }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="language" size={20} color="#6366F1" />
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageEmoji}>{getLanguageEmoji()}</Text>
            <Text style={styles.languageCode}>
              {/* {i18n.language.toUpperCase()} */}
              {i18n.language === "en"
                ? "EN"
                : i18n.language === "hi"
                ? "हिंदी"
                : "ગુજ"}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 8,
    backgroundColor: "#FFFFFF",
    padding: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  languageCode: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
    letterSpacing: 0.5,
  },
});

export default LanguageButton;

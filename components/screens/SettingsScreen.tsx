// screens/SettingsScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

const SettingsScreen = () => {
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] =
    useState(false);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => setIsLanguageSelectorVisible(true)}
      >
        <Text style={styles.settingText}>{t("selectLanguage")}</Text>
      </TouchableOpacity>

      <LanguageSelector
        isVisible={isLanguageSelectorVisible}
        onClose={() => setIsLanguageSelectorVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  settingItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
  },
});

export default SettingsScreen;

// components/LanguageSelector/LanguageSelector.tsx
import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPORTED_LANGUAGES } from "../../constants/languages";
import LanguageButton from "./LanguageButton";

interface LanguageSelectorProps {
  isVisible: boolean;
  onClose: () => void;
}

const LanguageSelector = ({ isVisible, onClose }: LanguageSelectorProps) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (languageCode: string) => {
    try {
      await AsyncStorage.setItem("@app_language", languageCode);
      await i18n.changeLanguage(languageCode);
      onClose();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("selectLanguage")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <LanguageButton
                key={language.code}
                isSelected={i18n.language === language.code}
                onPress={() => changeLanguage(language.code)}
                languageName={language.name}
                nativeName={language.nativeName}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: "#666",
  },
  languageList: {
    paddingBottom: 20,
  },
});

export default LanguageSelector;

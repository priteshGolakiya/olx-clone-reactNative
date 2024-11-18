// components/LanguageSelector/LanguageButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface LanguageButtonProps {
  isSelected: boolean;
  onPress: () => void;
  languageName: string;
  nativeName: string;
}

const LanguageButton = ({
  isSelected,
  onPress,
  languageName,
  nativeName,
}: LanguageButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected && styles.selectedButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
        {languageName}
      </Text>
      <Text style={[styles.nativeText, isSelected && styles.selectedText]}>
        {nativeName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginVertical: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedButton: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  nativeText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#fff",
  },
});

export default LanguageButton;

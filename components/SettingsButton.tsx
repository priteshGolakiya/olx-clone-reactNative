// components/SettingsButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface SettingsButtonProps {
  onPress: () => void;
}

const SettingsButton = ({ onPress }: SettingsButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <AntDesign name="setting" size={24} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});

export default SettingsButton;

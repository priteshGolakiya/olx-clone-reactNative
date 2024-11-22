import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosError } from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import uploadImage from "@/utils/uploadImage";
import { BASE_URL } from "@/utils/apiConfig";
import { useTranslation } from "react-i18next";
import { login } from "@/store/slices/userSlices";

interface EditProfileData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic: string;
}

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const token = useAppSelector((state) => state.token.token);
  const currentUser = useAppSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<EditProfileData>({
    username: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
    confirmPassword: "",
    profilePic: currentUser?.profilePic || "",
  });

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const dispatch = useAppDispatch();

  const handleUploadPic = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageSelected(true);
        setUploading(true);
        const uploadResponse = await uploadImage(result.assets[0]);
        setFormData((prev) => ({
          ...prev,
          profilePic: uploadResponse.secure_url,
        }));
        ToastAndroid.show(t("Image uploaded successfully"), ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("error::: ", error);
      alert(t("Image upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (uploading) {
      setError(t("Please wait for the image to finish uploading"));
      return;
    }

    // Optional password validation
    if (formData.password !== formData.confirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }

    // Optional password length check
    if (formData.password && formData.password.length < 6) {
      setError(t("Password must be at least 6 characters long"));
      return;
    }

    setLoading(true);
    try {
      // Prepare payload - only include fields that have changed or are being updated
      const payload: Partial<EditProfileData> = {
        ...(formData.username !== currentUser?.name && {
          username: formData.username,
        }),
        ...(formData.email !== currentUser?.email && { email: formData.email }),
        ...(formData.password && { password: formData.password }),
        ...(formData.profilePic !== currentUser?.profilePic && {
          profilePic: formData.profilePic,
        }),
      };

      const response = await axios.put(`${BASE_URL}/update-user`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;
      dispatch(
        login({
          ...userData,
        })
      );
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      setError("");
      setFormData({
        username: currentUser?.name || "",
        email: currentUser?.email || "",
        password: "",
        confirmPassword: "",
        profilePic: currentUser?.profilePic || "",
      });
      navigation.goBack(); // or navigate to profile page
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMessage = error.response?.data?.message || "An error occurred";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t("Edit Profile")}</Text>
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={
              formData.profilePic
                ? { uri: formData.profilePic }
                : require("@/assets/images/signin.gif")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadPic}
            disabled={uploading}
          >
            <Text style={styles.uploadButtonText}>
              {uploading ? t("Uploading...") : t("Change Photo")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Name")}:</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Enter your name")}
              value={formData.username}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, username: text }))
              }
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("Email")}:</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Enter your email")}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {t("New Password")} ({t("Optional")}):
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t("Enter new password")}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome
                  name={showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {formData.password && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("Confirm New Password")}:</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t("Confirm New Password")}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, confirmPassword: text }))
                  }
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome
                    name={showConfirmPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={uploading || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t("Update Profile")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 20,
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  uploadButton: {
    backgroundColor: "rgba(226, 232, 240, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  uploadButtonText: {
    fontSize: 12,
    color: "#4a5568",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  loginLink: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  loginLinkText: {
    color: "#4f46e5",
    fontSize: 14,
  },
  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
  },
});

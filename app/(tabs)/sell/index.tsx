import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import uploadImage from "@/utils/uploadImage";
import { BASE_URL } from "@/utils/apiConfig";
import { useAppSelector } from "@/store/hooks";
import NotLoggedIn from "@/components/NotLoggedIn";
import { KeyboardAvoidingView } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

interface ImageAsset {
  uri: string;
  type?: string;
  name?: string;
}

interface Category {
  _id: string;
  name: string;
  image?: string;
}
const MAX_IMAGES = 5;

export default function SellScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.token.token);

  const fetchCategories = async (): Promise<void> => {
    setLoadingCategories(true);
    try {
      const response = await axios.get<{ categories: Category[] }>(
        `${BASE_URL}/category`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert(t("Error"), t("Failed to load categories"));
    } finally {
      setLoadingCategories(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  // const pickImage = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsMultipleSelection: true,
  //       quality: 0.8,
  //     });

  //     if (!result.canceled) {
  //       const selectedAssets = result.assets.map((asset) => ({
  //         uri: asset.uri,
  //         type: "image/jpeg",
  //         name: asset.uri.split("/").pop(),
  //       }));
  //       setImages((prevImages) => [...prevImages, ...selectedAssets]);
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to pick image");
  //   }
  // };

  const pickImage = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert(
        t("Limit Reached"),
        `${t("You can only upload up to")} ${MAX_IMAGES} ${t("images")}`
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const remainingSlots = MAX_IMAGES - images.length;
        const selectedAssets = result.assets
          .slice(0, remainingSlots)
          .map((asset) => ({
            uri: asset.uri,
            type: "image/jpeg",
            name: asset.uri.split("/").pop(),
          }));

        if (result.assets.length > remainingSlots) {
          Alert.alert(
            t("Some images were not added"),
            `${t("Only")} ${remainingSlots} ${t("images")} ${t("were added to stay within the")} ${MAX_IMAGES} ${t("image limit")}`
          );
        }

        setImages((prevImages) => [...prevImages, ...selectedAssets]);
      }
    } catch (error) {
      Alert.alert(t("Error"), t("Failed to pick image"));
    }
  };
  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.price ||
      !formData.description ||
      !formData.category
    ) {
      Alert.alert(t("Error"), t("Please fill in all required fields"));
      return;
    }

    if (images.length === 0) {
      Alert.alert(t("Error"), t("Please select at least one image"));
      return;
    }

    setLoading(true);
    try {
      // Upload all images to Cloudinary
      const uploadPromises = images.map((image) => uploadImage(image));
      const uploadedImages = await Promise.all(uploadPromises);

      // Create product with image URLs
      const productData = {
        ...formData,
        imageUrl: uploadedImages.map((img) => img.secure_url),
        price: parseFloat(formData.price),
      };

      const response = await axios.post(
        `${BASE_URL}/product/uploadProduct`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert(t("Success"), t("Product listed successfully"));
        setFormData({
          title: "",
          price: "",
          description: "",
          category: "",
        });
        setImages([]);
        navigation.goBack();
      }
    } catch (error) {
      console.log("error::: ", error);
      Alert.alert(t("Error"), t("Failed to upload product. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <NotLoggedIn />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("Sell Your Product")}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("Product Name")}</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, title: text }))
            }
            placeholder={t("Enter product name")}
          />

          <Text style={styles.label}>{t("price")}</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, price: text }))
            }
            placeholder={t("Enter price")}
            keyboardType="numeric"
          />

          <Text style={styles.label}>{t("Category")}</Text>
          {loadingCategories ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={styles.loading}
            />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(itemValue) =>
                  setFormData((prev) => ({ ...prev, category: itemValue }))
                }
                style={styles.picker}
                dropdownIconColor="#666"
                mode="dropdown"
              >
                <Picker.Item
                  label={t("Select a category")}
                  value=""
                  style={styles.pickerPlaceholder}
                />
                {categories.map((category) => (
                  <Picker.Item
                    key={category._id}
                    label={t(category.name)}
                    value={category._id}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>{t("Description")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            placeholder={t("Enter product description")}
            multiline
            numberOfLines={4}
          />

          <View style={styles.imageSection}>
            <TouchableOpacity
              style={[
                styles.imagePickerButton,
                images.length >= MAX_IMAGES && styles.imagePickerButtonDisabled,
              ]}
              onPress={pickImage}
              disabled={images.length >= MAX_IMAGES}
            >
              <Text style={styles.imagePickerButtonText}>
                {t("Add Images")} ({images.length}/{MAX_IMAGES})
              </Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t("Post Ads")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "transparent",
  },
  pickerItem: {
    fontSize: 16,
    color: "#333",
    borderWidth: 10,
    borderColor: "red",
    backgroundColor: "#fff",
    padding: 5,
    marginVertical: Platform.OS === "ios" ? 4 : 0,
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: "#666",
    backgroundColor: "#fff",
  },
  imageSection: {
    marginVertical: 10,
  },
  imagePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePickerButtonDisabled: {
    backgroundColor: "#9E9E9E",
    opacity: 0.7,
  },
  imagePickerButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  // imagePickerButton: {
  //   backgroundColor: "#4CAF50",
  //   padding: 12,
  //   borderRadius: 8,
  //   marginBottom: 16,
  // },
  // imagePickerButtonText: {
  //   color: "#fff",
  //   textAlign: "center",
  //   fontSize: 16,
  //   fontWeight: "500",
  // },
  // imageContainer: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   gap: 8,
  //   marginBottom: 16,
  // },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 50,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

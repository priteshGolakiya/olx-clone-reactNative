import NotLoggedIn from "@/components/NotLoggedIn";
import { useAppSelector } from "@/store/hooks";
import { BASE_URL } from "@/utils/apiConfig";
import uploadImage from "@/utils/uploadImage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

interface RouteParams {
  id: string;
}

const MAX_IMAGES = 5;

export default function EditProductScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.token.token);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    isActive: true,
  });
  const [imageUrl, setImageUrl] = useState<ImageAsset[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product/${id}`);
      const product = response.data.product;

      setFormData({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.categoryId, // Using categoryId from the response
        isActive: product.isActive,
      });

      // Set existing images from the API response
      setExistingImages(product.image || []); // Using 'image' array from the response
    } catch (error) {
      console.log("error::: ", error);
      Alert.alert("Error", "Failed to fetch product details");
      navigation.goBack();
    } finally {
      setLoadingProduct(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${BASE_URL}/category`);
      setCategories(response.data.categories);
    } catch (error) {
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchProductDetails();
    }, [id])
  );

  const pickImage = async () => {
    const totalImages = imageUrl.length + existingImages.length;
    if (totalImages >= MAX_IMAGES) {
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
        const remainingSlots = MAX_IMAGES - totalImages;
        const selectedAssets = result.assets
          .slice(0, remainingSlots)
          .map((asset) => ({
            uri: asset.uri,
            type: "image/jpeg",
            name: asset.uri.split("/").pop(),
          }));

        if (result.assets.length > remainingSlots) {
          Alert.alert(
            "Some images were not added",
            `${t("Only")} ${remainingSlots} ${t("image")}(s) ${t(
              "were added to stay within the"
            )} ${MAX_IMAGES} ${t("image limit")}`
          );
        }

        setImageUrl((prevImages) => [...prevImages, ...selectedAssets]);
      }
    } catch (error) {
      Alert.alert(t("Error"), t("Failed to pick image"));
    }
  };

  const removeNewImage = (index: number) => {
    setImageUrl((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

    if (imageUrl.length === 0 && existingImages.length === 0) {
      Alert.alert(t("Error"), t("Please select at least one image"));
      return;
    }

    setLoading(true);
    try {
      // Upload new images to Cloudinary
      const uploadPromises = imageUrl.map((image) => uploadImage(image));
      const uploadedImages = await Promise.all(uploadPromises);

      // Combine existing and new image URLs
      const allImageUrls = [
        ...existingImages,
        ...uploadedImages.map((img) => img.secure_url),
      ];

      // Update product with all data
      const productData = {
        ...formData,
        imageUrl: allImageUrls, // Send all images including existing and new ones
        price: parseFloat(formData.price),
      };
      const response = await axios.put(
        `${BASE_URL}/product/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert(t("Success"), t("Product updated successfully"));
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert(t("Error"), t("Failed to update product. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const renderImageSection = () => (
    <View style={styles.imageSection}>
      <TouchableOpacity
        style={[
          styles.imagePickerButton,
          imageUrl.length + existingImages.length >= MAX_IMAGES &&
            styles.imagePickerButtonDisabled,
        ]}
        onPress={pickImage}
        disabled={imageUrl.length + existingImages.length >= MAX_IMAGES}
      >
        <Text style={styles.imagePickerButtonText}>
          {t("Add Images")} ({imageUrl.length + existingImages.length}/
          {MAX_IMAGES})
        </Text>
      </TouchableOpacity>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <View>
          <Text style={styles.subLabel}>{t("Existing Images")}</Text>
          <View style={styles.imageContainer}>
            {existingImages.map((imageUrl, index) => (
              <View key={`existing-${index}`} style={styles.imageWrapper}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeExistingImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* New Images */}
      {imageUrl.length > 0 && (
        <View>
          <Text style={styles.subLabel}>{t("New Images")}</Text>
          <View style={styles.imageContainer}>
            {imageUrl.map((image, index) => (
              <View key={`new-${index}`} style={styles.imageWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeNewImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (!token) {
    return <NotLoggedIn />;
  }

  if (loadingProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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
        <Text style={styles.title}>{t("Edit Ads")}</Text>
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
              >
                <Picker.Item label={t("Select a category")} value="" />
                {categories.map((category) => (
                  <Picker.Item
                    key={category._id}
                    label={t(category.name)}
                    value={category._id}
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

          {renderImageSection()}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t("Update Ads")}</Text>
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
    marginBottom: 50,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 8,
    color: "#666",
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  imageSection: {
    marginVertical: 16,
  },
  imagePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
    marginBottom: 8,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 12,
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    marginVertical: 20,
    elevation: 2,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  loading: {
    marginVertical: 10,
  },
});

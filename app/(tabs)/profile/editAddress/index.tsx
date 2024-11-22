// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   StyleSheet,
//   TextInput,
//   Text,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Keyboard,
//   TouchableWithoutFeedback,
//   SafeAreaView,
//   Dimensions,
// } from "react-native";
// import { router, useLocalSearchParams } from "expo-router";
// import { useAppSelector } from "@/store/hooks";
// import axios from "axios";
// import { BASE_URL } from "@/utils/apiConfig";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// const EditAddress: React.FC = () => {
//   const { addressId } = useLocalSearchParams();
//   const token = useAppSelector((state) => state.token.token);
//   const scrollViewRef = useRef<ScrollView>(null);

//   const [formData, setFormData] = useState({
//     street: "",
//     city: "",
//     state: "",
//     country: "",
//     zipCode: "",
//   });

//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/address/${addressId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data && response.data.address) {
//           const address = response.data.address;
//           setFormData({
//             street: address.street,
//             city: address.city,
//             state: address.state,
//             country: address.country,
//             zipCode: address.zipCode,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching address:", err);
//         Alert.alert(
//           "Error",
//           "Failed to load address information. Please try again."
//         );
//         router.back();
//       }
//     };

//     if (addressId) {
//       fetchAddress();
//     }
//   }, [addressId, token]);

//   const updateAddress = async () => {
//     try {
//       const emptyFields = Object.entries(formData).filter(
//         ([_, value]) => !value
//       );

//       if (emptyFields.length > 0) {
//         Alert.alert(
//           "Missing Information",
//           "Please fill in all address fields."
//         );
//         return;
//       }

//       const response = await axios.put(
//         `${BASE_URL}/address/${addressId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.data) {
//         throw new Error("Failed to update address");
//       }

//       Alert.alert("Success", "Address updated successfully!", [
//         {
//           text: "OK",
//           onPress: () => router.back(),
//         },
//       ]);
//     } catch (err) {
//       console.error("Error updating address:", err);
//       Alert.alert("Error", "Failed to update address. Please try again.");
//     }
//   };

//   // Function to scroll to the input
//   const scrollToInput = (y: number) => {
//     scrollViewRef.current?.scrollTo({
//       y: y,
//       animated: true,
//     });
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.keyboardAvoidingView}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           contentContainerStyle={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//           bounces={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <View style={styles.innerContainer}>
//               <View style={styles.formContainer}>
//                 <TextInput
//                   placeholder="Street Address"
//                   value={formData.street}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, street: text })
//                   }
//                   style={styles.inputField}
//                   returnKeyType="next"
//                   onFocus={() => scrollToInput(0)}
//                 />

//                 <TextInput
//                   placeholder="City"
//                   value={formData.city}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, city: text })
//                   }
//                   style={styles.inputField}
//                   returnKeyType="next"
//                   onFocus={() => scrollToInput(50)}
//                 />

//                 <TextInput
//                   placeholder="State"
//                   value={formData.state}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, state: text })
//                   }
//                   style={styles.inputField}
//                   returnKeyType="next"
//                   onFocus={() => scrollToInput(100)}
//                 />

//                 <TextInput
//                   placeholder="Country"
//                   value={formData.country}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, country: text })
//                   }
//                   style={styles.inputField}
//                   returnKeyType="next"
//                   onFocus={() => scrollToInput(150)}
//                 />

//                 <TextInput
//                   placeholder="ZIP Code"
//                   value={formData.zipCode}
//                   onChangeText={(text) =>
//                     setFormData({ ...formData, zipCode: text })
//                   }
//                   style={styles.inputField}
//                   keyboardType="numeric"
//                   returnKeyType="done"
//                   onSubmitEditing={Keyboard.dismiss}
//                   onFocus={() => scrollToInput(200)}
//                 />
//               </View>

//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                   style={[styles.btn, styles.cancelButton]}
//                   onPress={() => router.back()}
//                 >
//                   <Text style={[styles.btnText, styles.cancelButtonText]}>
//                     Cancel
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity style={styles.btn} onPress={updateAddress}>
//                   <Text style={styles.btnText}>Save Changes</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     padding: 26,
//     minHeight: SCREEN_HEIGHT - 500, // Ensure content is scrollable
//   },
//   formContainer: {
//     gap: 15,
//     marginBottom: 30,
//   },
//   inputField: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: "#ABABAB",
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     gap: 15,
//   },
//   btn: {
//     flex: 1,
//     backgroundColor: "#FF385C",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btnText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   cancelButton: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#FF385C",
//   },
//   cancelButtonText: {
//     color: "#FF385C",
//   },
// });

// export default EditAddress;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import { BASE_URL } from "@/utils/apiConfig";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const OPENCAGE_API_KEY = process.env.EXPO_PUBLIC_OPENCAGE_API_KEY;

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
}

interface OpenCageComponents {
  road?: string;
  town?: string;
  city?: string;
  state?: string;
  state_district?: string;
  country?: string;
  postcode?: string;
  suburb?: string;
}

interface OpenCageGeometry {
  lat: number;
  lng: number;
}

interface OpenCageResult {
  components: OpenCageComponents;
  geometry: OpenCageGeometry;
  formatted: string;
}

const EditAddress: React.FC = () => {
  const { addressId } = useLocalSearchParams();
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.token.token);

  const [formData, setFormData] = useState<AddressFormData>({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OpenCageResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/address/${addressId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.address) {
          const address = response.data.address;
          setFormData({
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode,
            latitude: address.latitude,
            longitude: address.longitude,
          });
        }
      } catch (err) {
        console.error("Error fetching address:", err);
        Alert.alert(
          t("Error"),
          t("Failed to load address information. Please try again.")
        );
        router.back();
      }
    };

    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    };

    if (addressId) {
      fetchAddress();
    }
    requestLocationPermission();
  }, [addressId, token]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (searchQuery.length > 2) {
      searchTimeout.current = setTimeout(() => {
        searchAddresses(searchQuery);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const formatAddress = (
    components: OpenCageComponents,
    geometry: OpenCageGeometry
  ): AddressFormData => {
    const street =
      components.road !== "unnamed road"
        ? components.suburb
        : components.road || "";

    return {
      street: street || "",
      city: components.city || components.state_district || "",
      state: components.state || "",
      country: components.country || "",
      zipCode: components.postcode || "",
      latitude: geometry?.lat || null,
      longitude: geometry?.lng || null,
    };
  };

  const searchAddresses = async (query: string) => {
    try {
      setSearching(true);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=${OPENCAGE_API_KEY}&limit=5`
      );
      const data = await response.json();

      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error("Error searching addresses:", error);
    } finally {
      setSearching(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      if (!locationPermission) {
        Alert.alert(
          t("Permission Required"),
          t("Please enable location services to use this feature.")
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const formattedAddress = formatAddress(
          data.results[0].components,
          data.results[0].geometry
        );
        setFormData(formattedAddress);
      }
    } catch (error) {
      Alert.alert(
        t("Error"),
        t("Failed to get current location. Please try again.")
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (result: OpenCageResult) => {
    const formattedAddress = formatAddress(result.components, result.geometry);
    setFormData(formattedAddress);
    setSearchResults([]);
    setSearchQuery("");
  };

  const updateAddress = async () => {
    try {
      const emptyFields = Object.entries(formData).filter(
        ([key, value]) => key !== "latitude" && key !== "longitude" && !value
      );

      if (emptyFields.length > 0) {
        Alert.alert(
          t("Missing Information"),
          t("Please fill in all address fields.")
        );
        return;
      }

      if (!formData.latitude || !formData.longitude) {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}`
          )}&key=${OPENCAGE_API_KEY}`
        );
        const data = await response.json();

        if (data.results && data.results[0]) {
          formData.latitude = data.results[0].geometry.lat;
          formData.longitude = data.results[0].geometry.lng;
        }
      }

      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/address/${addressId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("Failed to update address");
      }

      Alert.alert(t("Success"), t("Address updated successfully!"), [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error("Error updating address:", err);
      Alert.alert(t("Error"), t("Failed to update address. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) return null;

    return (
      <View style={styles.searchResultsContainer}>
        <ScrollView
          style={styles.searchResultsScroll}
          keyboardShouldPersistTaps="handled"
        >
          {searchResults.map((item) => (
            <TouchableOpacity
              key={item.formatted}
              style={styles.searchResult}
              onPress={() => handleAddressSelect(item)}
            >
              <Text style={styles.searchResultText}>{item.formatted}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder={t("Search for an address")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#ABABAB"
            />
            {searching && (
              <ActivityIndicator
                style={styles.searchingIndicator}
                color="#FF385C"
              />
            )}
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
              >
                <MaterialIcons name="close" size={24} color="#ABABAB" />
              </TouchableOpacity>
            )}
          </View>

          {renderSearchResults()}

          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <MaterialIcons name="my-location" size={24} color="#FF385C" />
            <Text style={styles.locationButtonText}>
              {t("Use Current Location")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholder={t("Street Address")}
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder={t("City")}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder={t("State")}
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder={t("Country")}
            value={formData.country}
            onChangeText={(text) => setFormData({ ...formData, country: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder={t("Zip Code")}
            value={formData.zipCode}
            onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
            keyboardType="numeric"
            placeholderTextColor="#ABABAB"
          />

          <TouchableOpacity
            style={[defaultStyles.btn, loading && styles.disabledButton]}
            onPress={updateAddress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={defaultStyles.btnText}>{t("Save Changes")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    padding: 10,
    backgroundColor: "#fff",
  },
  clearButton: {
    padding: 8,
    marginRight: 4,
  },
  searchingIndicator: {
    marginRight: 10,
  },
  searchResultsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  searchResultsScroll: {
    maxHeight: 200,
  },
  searchResult: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
  },
  searchResultText: {
    fontSize: 14,
    color: "#333",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ABABAB",
  },
  locationButtonText: {
    marginLeft: 8,
    color: "#FF385C",
    fontSize: 16,
  },
  formContainer: {
    padding: 26,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

const defaultStyles = StyleSheet.create({
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#FF385C",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EditAddress;

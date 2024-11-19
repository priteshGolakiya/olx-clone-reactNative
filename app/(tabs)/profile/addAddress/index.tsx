// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   TextInput,
//   Text,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import Constants from "expo-constants";
// import { router } from "expo-router";
// import { useAppSelector } from "@/store/hooks";
// import axios from "axios";
// import { BASE_URL } from "@/utils/apiConfig";

// const CreateAddress: React.FC = () => {
//   const [formData, setFormData] = useState({
//     street: "",
//     city: "",
//     state: "",
//     country: "",
//     zipCode: "",
//   });

//   const token = useAppSelector((state) => state.token.token);

//   const createAddress = async () => {
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

//       const response = await axios.post(
//         `${BASE_URL}/address/`,
//         {
//           street: formData.street,
//           city: formData.city,
//           state: formData.state,
//           country: formData.country,
//           zipCode: formData.zipCode,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.data.success) {
//         throw new Error("Failed to create address");
//       }

//       const data = await response.data.newAddress;
//       Alert.alert("Success", "Address created successfully!", [
//         {
//           text: "OK",
//           onPress: () => router.back(),
//         },
//       ]);
//     } catch (err) {
//       console.error("Error creating address:", err);
//       Alert.alert("Error", "Failed to create address. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Street Address"
//         value={formData.street}
//         onChangeText={(text) => setFormData({ ...formData, street: text })}
//         style={[defaultStyles.inputField, { marginBottom: 15 }]}
//       />

//       <TextInput
//         placeholder="City"
//         value={formData.city}
//         onChangeText={(text) => setFormData({ ...formData, city: text })}
//         style={[defaultStyles.inputField, { marginBottom: 15 }]}
//       />

//       <TextInput
//         placeholder="State"
//         value={formData.state}
//         onChangeText={(text) => setFormData({ ...formData, state: text })}
//         style={[defaultStyles.inputField, { marginBottom: 15 }]}
//       />

//       <TextInput
//         placeholder="Country"
//         value={formData.country}
//         onChangeText={(text) => setFormData({ ...formData, country: text })}
//         style={[defaultStyles.inputField, { marginBottom: 15 }]}
//       />

//       <TextInput
//         placeholder="ZIP Code"
//         value={formData.zipCode}
//         onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
//         style={[defaultStyles.inputField, { marginBottom: 30 }]}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity style={defaultStyles.btn} onPress={createAddress}>
//         <Text style={defaultStyles.btnText}>Save Address</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 26,
//   },
// });

// const defaultStyles = StyleSheet.create({
//   inputField: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: "#ABABAB",
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   btn: {
//     backgroundColor: "#FF385C",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btnText: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

// export default CreateAddress;

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
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import { BASE_URL } from "@/utils/apiConfig";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import "react-native-get-random-values";

const OPENCAGE_API_KEY = "da3020cad2cc4ee79e7d4669235ca88f";

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

const CreateAddress: React.FC = () => {
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

  const token = useAppSelector((state) => state.token.token);
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    Keyboard.dismiss();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    })();
  }, []);

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
    console.log("components::: ", components);
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
          "Permission Required",
          "Please enable location services to use this feature."
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
      Alert.alert("Error", "Failed to get current location. Please try again.");
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

  const createAddress = async () => {
    try {
      const emptyFields = Object.entries(formData).filter(
        ([key, value]) => key !== "latitude" && key !== "longitude" && !value
      );

      if (emptyFields.length > 0) {
        Alert.alert(
          "Missing Information",
          "Please fill in all address fields."
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
      const response = await axios.post(`${BASE_URL}/address/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to create address");
      }

      Alert.alert("Success", "Address created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error("Error creating address:", err);
      Alert.alert("Error", "Failed to create address. Please try again.");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Search for an address"
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
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Street Address"
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
            editable={true}
          />

          <TextInput
            placeholder="State"
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder="Country"
            value={formData.country}
            onChangeText={(text) => setFormData({ ...formData, country: text })}
            style={[defaultStyles.inputField, { marginBottom: 15 }]}
            placeholderTextColor="#ABABAB"
          />

          <TextInput
            placeholder="ZIP Code"
            value={formData.zipCode}
            onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
            keyboardType="numeric"
            placeholderTextColor="#ABABAB"
          />

          <TouchableOpacity
            style={[defaultStyles.btn, loading && styles.disabledButton]}
            onPress={createAddress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={defaultStyles.btnText}>Save Address</Text>
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

export default CreateAddress;

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeToken } from "@/store/slices/tokenSlice";
import { logout } from "@/store/slices/userSlices";
import { BASE_URL } from "@/utils/apiConfig";
import NotLoggedIn from "@/components/NotLoggedIn";
import AddressList from "@/components/profile/Address";
import { useTranslation } from "react-i18next";
import LoaderContainer from "@/components/LoaderContainer";
import { useRouter } from "expo-router";

interface UserData {
  username: string;
  email: string;
  profilePic: string;
  addresses: Address[];
  phoneNumber: string;
}

interface Address {
  id: string;
  type: string;
  address: string;
  isDefault: boolean;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useAppSelector((state) => state.token.token);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync("token");
        dispatch(logout());
        dispatch(removeToken());
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchUserData();
      }
    }, [token])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  }, []);

  const logoutHandler = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      dispatch(logout());
      dispatch(removeToken());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!token) {
    return <NotLoggedIn />;
  }

  if (loading) {
    return <LoaderContainer />;
  }
  const navigateToEditProfile = () => {
    router.push("/(tabs)/profile/editProfile");
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: userData?.profilePic || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={navigateToEditProfile}
          >
            <MaterialIcons name="edit" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{userData?.username}</Text>
          <Text style={styles.username}>+91 {userData?.phoneNumber}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
          <Text style={styles.logoutText}>{t("Logout")}</Text>
        </TouchableOpacity>
      </View>
      <AddressList
        addresses={userData?.addresses || []}
        fetchUserData={fetchUserData}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileInfo: {
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#FFF",
    opacity: 0.9,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  logoutText: {
    color: "#FFF",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default ProfilePage;

import { useAppSelector } from "@/store/hooks";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import axios from "axios";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { BASE_URL } from "@/utils/apiConfig";
import { useTranslation } from "react-i18next";
import LoaderContainer from "@/components/LoaderContainer";

interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  profilePic: string;
  phoneNumber: string;
  isBlocked: boolean;
  createdAt: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      Alert.alert(t("Error"), t("Failed to fetch users"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/user/${userId}/toggle-restriction`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBlocked: !currentStatus } : user
        )
      );
    } catch (error) {
      Alert.alert(t("Error"), t("Failed to update user status"));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      t("Confirm Delete"),
      t("Are you sure you want to delete this user?"),
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/admin/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUsers(users.filter((user) => user._id !== userId));
            } catch (error) {
              Alert.alert(t("Error"), t("Failed to delete user"));
            }
          },
        },
      ]
    );
  };

  const handleUpdateRole = async (
    userId: string,
    currentRole: "user" | "admin"
  ) => {
    const newRole = currentRole === "user" ? "admin" : "user";
    try {
      await axios.patch(
        `${BASE_URL}/admin/user/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      Alert.alert(t("Error"), t("Failed to update user role"));
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.cardHeader}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: item.profilePic || "https://via.placeholder.com/100",
            }}
            style={styles.profilePic}
            defaultSource={require("@/assets/images/defaultImage.png")}
            resizeMode="contain"
          />
          <View style={styles.userMainInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <View style={styles.contactInfo}>
              <Feather name="mail" size={14} color="#666" style={styles.icon} />
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Feather
                name="phone"
                size={14}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.phoneNumber}>
                {item.phoneNumber || "No phone"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.badges}>
          <Text
            style={[
              styles.badge,
              {
                backgroundColor: item.role === "admin" ? "#4CAF50" : "#2196F3",
              },
            ]}
          >
            {item.role.toUpperCase()}
          </Text>
          {item.isBlocked && (
            <Text style={[styles.badge, { backgroundColor: "#f44336" }]}>
              BLOCKED
            </Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleToggleBlock(item._id, item.isBlocked)}
          style={styles.actionButton}
        >
          <MaterialIcons
            name={item.isBlocked ? "lock-open" : "lock"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleUpdateRole(item._id, item.role)}
          style={styles.actionButton}
        >
          <MaterialIcons name="swap-horiz" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteUser(item._id)}
          style={styles.actionButton}
        >
          <MaterialIcons name="delete" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoaderContainer />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("Users Management")}</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchUsers();
            }}
          />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#fff",
  },
  list: {
    padding: 16,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "column",
    gap: 12,
  },
  profileSection: {
    flexDirection: "row",
    gap: 16,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  userMainInfo: {
    flex: 1,
    justifyContent: "center",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  icon: {
    marginRight: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  phoneNumber: {
    fontSize: 14,
    color: "#666",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: "#fff",
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
});

export default UsersManagement;

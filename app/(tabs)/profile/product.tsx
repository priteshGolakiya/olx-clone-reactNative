import { useAppSelector } from "@/store/hooks";
import { BASE_URL } from "@/utils/apiConfig";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Product {
  _id: string;
  title: string;
  price: string;
  status: string;
  description: string;
  images: string[];
  category: string;
  isActive: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useAppSelector((state) => state.token.token);
  const router = useRouter();

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: Product[] }>(
        `${BASE_URL}/admin/product/approval-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // useEffect(() => {
  //   fetchProducts();
  // }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleApproval = async (
    productId: string,
    status: "approved" | "rejected"
  ): Promise<void> => {
    try {
      await axios.put(
        `${BASE_URL}/admin/product/approve-request/${productId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", `Product ${status} successfully`);
      fetchProducts();
    } catch (error) {
      Alert.alert("Error", `Failed to ${status} product`);
      console.error(error);
    }
  };

  const handleProductPress = (product: Product): void => {
    router.push(`/productDetails/${product._id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#F44336";
      default:
        return "#666";
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image-not-supported" size={40} color="#666" />
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <Text style={styles.productCategory} numberOfLines={1}>
          {item.category}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleApproval(item._id, "approved")}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleApproval(item._id, "rejected")}
          >
            <MaterialIcons name="cancel" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>No products found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Management</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  listContainer: {
    padding: 8,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  contentContainer: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0066CC",
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 8,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
  },
  emptyListText: {
    fontSize: 18,
  },
});

export default ProductManagement;

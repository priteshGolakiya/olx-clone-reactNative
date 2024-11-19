import NotLoggedIn from "@/components/NotLoggedIn";
import { useAppSelector } from "@/store/hooks";
import { BASE_URL } from "@/utils/apiConfig";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SPACING = 12;
const CARD_WIDTH = (width - SPACING * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 2;
const CARD_IMAGE_HEIGHT = CARD_WIDTH * 1.1;

const COLORS = {
  background: "#F4F6F9",
  primary: "#5E72E4",
  white: "#FFFFFF",
  text: "#32325D",
  textLight: "#8A94A6",
  border: "#E8ECF2",
  danger: "#FF4444",
};

interface Ads {
  _id: string;
  user: number;
  category: number;
  price: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // For iOS, you might want to use a custom toast component or Alert
    Alert.alert("", message);
  }
};

const AdCard: React.FC<{ ad: Ads; onDelete: (id: string) => void }> = ({
  ad,
  onDelete,
}) => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const redirectToDetails = (id: string) => {
    router.push(`/productDetails/${id}`);
  };
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPressIn={() => setIsPressed(true)}
      onPress={() => redirectToDetails(ad._id)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={[styles.card, isPressed && styles.cardPressed]}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: ad.images[0] || "https://via.placeholder.com/150" }}
            style={styles.image}
            resizeMode="contain"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)"]}
            style={styles.imageOverlay}
          />
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{ad.price}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {ad.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {ad.description}
          </Text>
          <Text style={styles.dateText}>{formatDate(ad.createdAt)}</Text>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(ad._id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyAdsList: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No Ads Posted Yet</Text>
    <Text style={styles.emptySubtitle}>Your posted ads will appear here</Text>
  </View>
);

const MyAdsScreen: React.FC = () => {
  const [ads, setAds] = useState<Ads[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const token = useAppSelector((state) => state.token.token);

  const fetchUserAds = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/user-ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAds(response.data.ads);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch ads";
      showToast(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  const handleDeleteAd = useCallback(
    async (adId: string) => {
      Alert.alert("Delete Ad", "Are you sure you want to delete this ad?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/user-ads/${adId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setAds((prev) => prev.filter((ad) => ad._id !== adId));
              showToast("Ad deleted successfully");
            } catch (error: any) {
              const errorMessage =
                error.response?.data?.message || "Failed to delete ad";
              showToast(errorMessage);
            }
          },
        },
      ]);
    },
    [token]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUserAds();
  }, [fetchUserAds]);

  useEffect(() => {
    if (token) {
      fetchUserAds();
    }
  }, [token, fetchUserAds]);

  if (!token) {
    return <NotLoggedIn />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Ads</Text>
        </View>

        {loading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={ads}
            renderItem={({ item }) => (
              <AdCard ad={item} onDelete={handleDeleteAd} />
            )}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyAdsList}
            ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
            ListHeaderComponent={() => <View style={{ height: SPACING }} />}
            ListFooterComponent={() => <View style={{ height: SPACING * 5 }} />}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: SPACING,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: SPACING,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    height: CARD_IMAGE_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  priceContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 4,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
  },
});

export default MyAdsScreen;

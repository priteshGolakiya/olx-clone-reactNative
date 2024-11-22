import LoaderContainer from "@/components/LoaderContainer";
import NotLoggedIn from "@/components/NotLoggedIn";
import { useAppSelector } from "@/store/hooks";
import { BASE_URL } from "@/utils/apiConfig";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { RefreshControl } from "react-native-gesture-handler";

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
  status: string;
  description: string;
}

interface AdCardProps {
  ad: Ads;
  onDelete?: (id: string) => void;
  onSell?: (id: string) => void;
}
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "approved":
      return "#4CAF50"; // Green
    case "pending":
      return "#FFA000"; // Amber
    case "rejected":
      return "#F44336"; // Red
    default:
      return "#757575"; // Default Grey
  }
};

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

const AdCard: React.FC<AdCardProps> = ({ ad, onDelete, onSell }) => {
  const [isPressed, setIsPressed] = useState(false);
  const statusColor = getStatusColor(ad.status);
  const router = useRouter();
  const { t } = useTranslation();

  // const redirectToDetails = (id: string) => {
  //   router.push(`/productDetails/${id}`);
  // };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(ad._id);
    }
  };

  const handleSell = () => {
    if (onSell) {
      onSell(ad._id);
    }
  };
  const redirectToDetails = (id: string) => {
    router.push(`/(tabs)/myAds/editProduct/${id}`); // Update this path according to your routing structure
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
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: ad.images[0] || "https://via.placeholder.com/150" }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            style={styles.imageOverlay}
          />
          <View style={styles.badgesContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>₹{ad.price}</Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusText}>{ad.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {ad.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {ad.description}
          </Text>
          <Text style={styles.dateText}>{formatDate(ad.createdAt)}</Text>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>{t("Delete")}</Text>
          </TouchableOpacity>

          {ad.isActive ? (
            <TouchableOpacity style={styles.sellButton} onPress={handleSell}>
              <Text style={styles.sellButtonText}>{t("Sell")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sellButton, { backgroundColor: "orange" }]}
            >
              <Text style={styles.deleteButtonText}>{t("Sold out")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyAdsList: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t("No Ads Posted Yet")}</Text>
      <Text style={styles.emptySubtitle}>
        {t("Your posted ads will appear here")}
      </Text>
      <Link href="/(tabs)/sell" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t("Post an Ad")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const MyAdsScreen: React.FC = () => {
  const [ads, setAds] = useState<Ads[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const token = useAppSelector((state) => state.token.token);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  });
  const { t } = useTranslation();

  const fetchUserAds = useCallback(
    async (page: number = 1, refresh: boolean = false) => {
      if (!token) return;

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/user-ads?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          if (refresh || page === 1) {
            setAds(response.data.ads);
          } else {
            setAds((prevAds) => [...prevAds, ...response.data.ads]);
          }
          setPagination(response.data.pagination);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch ads";
        showToast(errorMessage);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [token]
  );

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
  const handleSellAd = useCallback(
    async (adId: string) => {
      Alert.alert("Confirm Sale", "Mark this ad as sold?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              const response = await axios.post(
                `${BASE_URL}/product/sell/${adId}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                // Update the local state to reflect the sold status
                setAds((prev) =>
                  prev.map((ad) =>
                    ad._id === adId ? { ...ad, isActive: false } : ad
                  )
                );
                showToast("Ad marked as sold successfully");
              }
            } catch (error: any) {
              console.log("error::: ", error);
              const errorMessage =
                error.response?.data?.message || "Failed to mark ad as sold";
              showToast(errorMessage);
            }
          },
        },
      ]);
    },
    [token]
  );
  const handleLoadMore = useCallback(() => {
    if (
      !loadingMore &&
      pagination.hasMore &&
      pagination.currentPage < pagination.totalPages
    ) {
      fetchUserAds(pagination.currentPage + 1);
    }
  }, [loadingMore, pagination, fetchUserAds]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUserAds(1, true);
  }, [fetchUserAds]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (token && isActive) {
          await fetchUserAds(1, true);
        }
      };

      fetchData();

      // Cleanup function
      return () => {
        isActive = false;
      };
    }, [token, fetchUserAds])
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  if (!token) {
    return <NotLoggedIn />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("My Ads")}</Text>
          {pagination.totalItems > 0 && (
            <Text style={styles.headerSubtitle}>
              {t("Total Ads")}: {pagination.totalItems}
            </Text>
          )}
        </View>

        {loading ? (
          <LoaderContainer />
        ) : (
          <FlatList
            data={ads}
            renderItem={({ item }) => (
              <AdCard
                ad={item}
                onDelete={handleDeleteAd}
                onSell={handleSellAd}
              />
            )}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: SPACING * 8 }, // Add extra padding at the bottom
            ]}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyAdsList}
            ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
            ListHeaderComponent={() => <View style={{ height: SPACING }} />}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
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
    backgroundColor: "#F5F5F5",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  badgesContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    backgroundColor: "#5E72E4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#32325D",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#8A94A6",
    marginBottom: 8,
    lineHeight: 18,
  },
  dateText: {
    fontSize: 12,
    color: "#8A94A6",
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: "auto",
  },
  deleteButtonText: {
    color: "#FFFFFF",
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
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerLoader: {
    paddingVertical: SPACING,
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  sellButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  sellButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default MyAdsScreen;

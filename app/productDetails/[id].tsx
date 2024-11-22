import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  Linking,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "@/utils/apiConfig";
import { useTranslation } from "react-i18next";
import LoaderContainer from "@/components/LoaderContainer";
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 88 : 64;

type RouteParams = {
  productDetails: {
    id: string;
  };
};

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

interface User {
  _id: string;
  userName: string;
  email: string;
  profilePic: string;
  phoneNumber: string;
}

interface ProductDetails {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string[];
  isActive: boolean;
  user: User;
  address: Address[];
  category: string;
  categoryId: string;
}

const DEFAULT_AVATAR = "@/assets/images/avatar.png";

const ProductDetailsScreen = () => {
  const { t } = useTranslation();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Add this to prevent multiple API calls
  const isFirstRender = useRef(true);

  const scrollY = new Animated.Value(0);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, "productDetails">>();

  const headerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [scrollY]
  );

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/product/${route.params.id}`
      );
      setProduct(response.data.product);
      if (response.data.product) {
        navigation.setOptions({
          title: response.data.product.title,
        });
      } else {
        navigation.setOptions({
          title: "Product Details",
        });
      }
    } catch (err) {
      setError("Couldn't fetch Product details");
    } finally {
      setLoading(false);
    }
  }, [navigation, route.params.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "rgba(0,0,0,0.2)",
        fontSize: 48,
        fontWeight: "bold",
      },
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (product) {
              Share.share({
                message: `Check out this ${product.title} at ₹${product.price}!`,
              });
            }
          }}
        >
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, product]);

  // Modified useEffect to prevent unnecessary API calls
  useEffect(() => {
    if (isFirstRender.current) {
      fetchProductDetails();
      isFirstRender.current = false;
    }
  }, []);

  const renderImagePagination = useCallback(() => {
    if (!product?.image || product.image.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {product.image.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentImageIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  }, [product, currentImageIndex]);

  const handleCall = useCallback(async (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          t("Error"),
          t("Phone calls are not supported on this device")
        );
      }
    } catch (error) {
      Alert.alert(
        t("Error"),
        t("Could not initiate phone call. Please try again.")
      );
    }
  }, []);

  const handleWhatsApp = useCallback(
    async (phoneNumber: string, productTitle: string) => {
      // Remove any non-numeric characters from phone number
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
      // Create message template
      const message = `${t(
        "Hi, I'm interested in your listing"
      )}: ${productTitle}. ${t("Could you provide more information?")}`;
      // Create WhatsApp URL with phone number and encoded message
      const whatsappUrl = `whatsapp://send?phone=${cleanPhoneNumber}&text=${encodeURIComponent(
        message
      )}`;

      try {
        const supported = await Linking.canOpenURL(whatsappUrl);
        if (supported) {
          await Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp if app is not installed
          const webWhatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(
            message
          )}`;
          await Linking.openURL(webWhatsappUrl);
        }
      } catch (error) {
        Alert.alert(
          t("Error"),
          t("Could not open WhatsApp. Please make sure it's installed.")
        );
      }
    },
    []
  );

  const renderCarouselItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      return (
        <Pressable
          style={styles.carouselItem}
          onPress={() => {
            setModalImageIndex(index);
            setIsModalVisible(true);
          }}
        >
          <Image
            source={{ uri: item }}
            style={styles.petImage}
            resizeMode="cover"
          />
        </Pressable>
      );
    },
    []
  );

  const renderModalCarousel = useCallback(() => {
    if (!product?.image) return null;

    return (
      <View style={styles.modalCarouselContainer}>
        <Carousel
          loop
          width={width}
          height={height * 0.7}
          data={product.image}
          defaultIndex={modalImageIndex}
          onSnapToItem={(index) => setModalImageIndex(index)}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        />
        <View style={styles.modalPaginationContainer}>
          <Text style={styles.modalPaginationText}>
            {modalImageIndex + 1} / {product.image.length}
          </Text>
        </View>
      </View>
    );
  }, [product, modalImageIndex]);

  const renderSellerCard = () => (
    <TouchableOpacity style={styles.sellerCard}>
      <LinearGradient
        colors={["#F5F5F5", "#FFFFFF"]}
        style={styles.sellerGradient}
      >
        <Image
          source={
            product?.user?.profilePic
              ? { uri: product.user.profilePic }
              : require("@/assets/images/avatar.png")
          }
          style={styles.sellerImage}
        />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{product?.user.userName}</Text>
          <Text style={styles.sellerContact}>{product?.user.phoneNumber}</Text>
        </View>
        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={[styles.contactButton, { marginRight: 8 }]}
            onPress={() => product && handleCall(product.user.phoneNumber)}
          >
            <Ionicons name="call-outline" size={20} color="#E31837" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() =>
              product && handleWhatsApp(product.user.phoneNumber, product.title)
            }
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoaderContainer />;
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#E31837" />
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchProductDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {product?.image && (
            <Carousel
              loop
              autoPlay={true}
              width={width}
              height={width * 0.8}
              data={product.image}
              onSnapToItem={setCurrentImageIndex}
              renderItem={renderCarouselItem}
              autoPlayInterval={3000}
            />
          )}
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>
              {currentImageIndex + 1} / {product?.image?.length || 0}
            </Text>
          </View>
        </View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {renderModalCarousel()}
          </View>
        </Modal>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.category}>{t(product.category)}</Text>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>₹{product.price}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: product.isActive ? "#E8F5E9" : "#FFEBEE" },
              ]}
            >
              <MaterialIcons
                name="delivery-dining"
                size={16}
                color={product.isActive ? "#2E7D32" : "#C62828"}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: product.isActive ? "#2E7D32" : "#C62828" },
                ]}
              >
                {product.isActive ? "Available" : "Not Available"}
              </Text>
            </View>
          </View>

          {renderSellerCard()}

          {product.address && product.address.length > 0 && (
            <View style={styles.locationCard}>
              <MaterialIcons name="location-on" size={24} color="#666" />
              <View style={styles.addressInfo}>
                <Text style={styles.addressText}>
                  {product.address[0].street}, {product.address[0].city}
                </Text>
                <Text style={styles.addressSubtext}>
                  {product.address[0].state}, {product.address[0].country}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About</Text>
            <Text
              style={styles.description}
              numberOfLines={showFullDescription ? undefined : 3}
            >
              {product.description}
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowFullDescription((prev) => !prev)}
            >
              <Text style={styles.readMoreText}>
                {showFullDescription ? "Read Less" : "Read More"}
              </Text>
              <Ionicons
                name={showFullDescription ? "chevron-up" : "chevron-down"}
                size={16}
                color="#E31837"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() =>
            product && handleWhatsApp(product.user.phoneNumber, product.title)
          }
        >
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.messageButtonText}>Message on WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          {renderModalCarousel()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent dark background
    zIndex: 100,
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 44 : 20,
  },
  scrollViewContent: {
    alignItems: "stretch", // Use 'stretch' instead of 'center' if you want full-width content
    paddingBottom: 100, // Add some bottom padding if needed
  },
  carouselItem: {
    width: width,
    height: width * 0.8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCarouselContainer: {
    width: width,
    height: height * 0.7,
  },
  modalImage: {
    width: width,
    height: height * 0.7,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  modalPaginationContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
  },
  modalPaginationText: {
    color: "#fff",
    fontSize: 14,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 20,
  },
  paginationText: {
    color: "#fff",
    fontSize: 14,
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  // modalContainer: {
  //   flex: 1,
  //   backgroundColor: "rgba(0, 0, 0, 0.9)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  fullSizeImage: {
    width: "90%",
    height: "75%",
  },
  // closeButton: {
  //   position: "absolute",
  //   top: 50,
  //   right: 20,
  //   padding: 10,
  // },
  closeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  imageContainer: {
    height: height * 0.5,
    backgroundColor: "#f5f5f5",
  },
  petImage: {
    width,
    height: height * 0.5,
  },
  // paginationContainer: {
  //   flexDirection: "row",
  //   position: "absolute",
  //   bottom: 20,
  //   alignSelf: "center",
  // },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 24,
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    paddingBottom: 100, // Add space for bottom bar
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E31837",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  sellerCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sellerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  // sellerImage: {
  //   width: 48,
  //   height: 48,
  //   borderRadius: 24,
  // },
  sellerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sellerContact: {
    fontSize: 14,
    color: "#666",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    marginBottom: 24,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 16,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  addressSubtext: {
    fontSize: 14,
    color: "#666",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  readMoreText: {
    color: "#E31837",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#E31837",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#E31837",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  contactButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButton: {
    backgroundColor: "#25D366", // WhatsApp green color
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ProductDetailsScreen;

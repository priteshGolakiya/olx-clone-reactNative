// import { BASE_URL } from "@/utils/apiConfig";
// import axios from "axios";
// import { LinearGradient } from "expo-linear-gradient";
// import { useFocusEffect } from "expo-router";
// import React, { useCallback, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   ListRenderItem,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 48) / 2;
// interface Category {
//   _id: string;
//   name: string;
//   image?: string;
// }

// interface Item {
//   _id: string;
//   title: string;
//   image?: string;
// }
// interface Product {
//   _id: string;
//   category: string;
//   description: string;
//   images: string[];
//   price: string;
//   isActive: boolean;
//   createdAt: string;
//   title?: string;
// }

// type DataType = Category[] | Item[];

// const HomeScreen: React.FC = () => {
//   const { t } = useTranslation();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [data, setData] = useState<DataType>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const scrollY = new Animated.Value(0);

//   // Reference to the categories FlatList for scrolling
//   const categoriesListRef = useRef<FlatList>(null);

//   const fetchCategories = async (): Promise<void> => {
//     try {
//       const response = await axios.get<{ categories: Category[] }>(
//         `${BASE_URL}/category`
//       );
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchData = async (categoryId: string): Promise<void> => {
//     setLoading(true);
//     try {
//       let response;
//       if (categoryId === "all") {
//         response = await axios.get<{ categories: Category[] }>(
//           `${BASE_URL}/category`
//         );
//         setData(response.data.categories);
//       } else {
//         response = await axios.get<{ products: Item[] }>(
//           `${BASE_URL}/category/${categoryId}/product`
//         );
//         console.log("response.data.products::: ", response.data.products);
//         setData(response.data.products);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchData(selectedCategory);
//     setRefreshing(false);
//   }, [selectedCategory]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCategories();
//       fetchData("all");
//     }, [])
//   );

//   const handleCategorySelect = (categoryId: string, index: number): void => {
//     setSelectedCategory(categoryId);
//     fetchData(categoryId);

//     // Scroll the categories list to show the selected category
//     categoriesListRef.current?.scrollToIndex({
//       index: index,
//       animated: true,
//       viewPosition: 0.5, // Center the selected category
//     });
//   };

//   // Find category index helper function
//   const findCategoryIndex = (categoryId: string): number => {
//     const allCategories = [
//       { _id: "all", name: "All" } as Category,
//       ...categories,
//     ];
//     return allCategories.findIndex((category) => category._id === categoryId);
//   };

//   const renderCard: ListRenderItem<Product> = ({ item }) => {
//     return (
//       <TouchableOpacity style={styles.cardContainer}>
//         <View style={styles.card}>
//           <Image
//             source={{
//               uri: item.images[0] || "https://via.placeholder.com/150",
//             }}
//             style={styles.cardImage}
//           />
//           <LinearGradient
//             colors={["transparent", "rgba(0,0,0,0.8)"]}
//             style={styles.gradient}
//           >
//             <Text style={styles.cardTitle} numberOfLines={1}>
//               {t("Price")}: {item.price}
//             </Text>
//             <Text style={styles.cardDescription} numberOfLines={2}>
//               {item.description}
//             </Text>
//           </LinearGradient>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const getItemLayout = (data: any, index: number) => ({
//     length: 50, // Approximate height of category item
//     offset: 50 * index,
//     index,
//   });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Explore Categories</Text>

//       <View style={styles.categoriesWrapper}>
//         <FlatList
//           ref={categoriesListRef}
//           data={[{ _id: "all", name: t("All") } as Category, ...categories]}
//           horizontal
//           keyExtractor={(item) => item._id}
//           renderItem={({ item, index }) => (
//             <TouchableOpacity
//               style={[
//                 styles.categoryItem,
//                 item._id === selectedCategory && styles.selectedCategory,
//               ]}
//               onPress={() => handleCategorySelect(item._id, index)}
//             >
//               <Text
//                 style={[
//                   styles.categoryText,
//                   item._id === selectedCategory && styles.selectedCategoryText,
//                 ]}
//               >
//                 {t(item.name)}
//               </Text>
//             </TouchableOpacity>
//           )}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesContainer}
//           getItemLayout={getItemLayout}
//         />
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#6366f1" />
//         </View>
//       ) : (
//         <Animated.FlatList
//           data={data}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderCard}
//           numColumns={2}
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: true }
//           )}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     paddingTop: 16,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#1f2937",
//     marginBottom: 20,
//     paddingHorizontal: 16,
//     letterSpacing: -0.5,
//   },
//   categoriesWrapper: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   categoriesContainer: {
//     paddingHorizontal: 16,
//   },
//   categoryItem: {
//     paddingVertical: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 6,
//     marginVertical: 6,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   selectedCategory: {
//     backgroundColor: "#6366f1",
//   },
//   categoryText: {
//     fontSize: 16,
//     color: "#4b5563",
//     fontWeight: "600",
//   },
//   selectedCategoryText: {
//     color: "#fff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   list: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 24,
//   },
//   cardContainer: {
//     width: CARD_WIDTH,
//     padding: 4,
//   },
//   card: {
//     height: CARD_WIDTH * 1.2,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   cardDescription: {
//     fontSize: 12,
//     color: "#fff",
//     marginTop: 4,
//     textShadowColor: "rgba(0, 0, 0, 0.3)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   selectedCard: {
//     borderWidth: 2,
//     borderColor: "#6366f1",
//   },
//   cardImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   gradient: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: "50%",
//     justifyContent: "flex-end",
//     padding: 8,
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#fff",
//     textShadowColor: "rgba(0, 0, 0, 0.3)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
// });

// export default HomeScreen;

// import React, { useCallback, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";
// import { BASE_URL } from "@/utils/apiConfig";
// import { useTranslation } from "react-i18next";

// const { width } = Dimensions.get("window");

// // Category Types and Component
// interface Category {
//   _id: string;
//   name: string;
// }

// interface CategoryListProps {
//   categories: Category[];
//   selectedCategory: string;
//   onSelectCategory: (categoryId: string) => void;
// }

// const CategoryList: React.FC<CategoryListProps> = ({
//   categories,
//   selectedCategory,
//   onSelectCategory,
// }) => {
//   const { t } = useTranslation();
//   const allCategories = [{ _id: "all", name: "All" }, ...categories];

//   return (
//     <FlatList
//       data={allCategories}
//       horizontal
//       keyExtractor={(item) => item._id}
//       renderItem={({ item }) => (
//         <TouchableOpacity
//           style={[
//             styles.categoryItem,
//             item._id === selectedCategory && styles.selectedCategory,
//           ]}
//           onPress={() => onSelectCategory(item._id)}
//         >
//           <Text
//             style={[
//               styles.categoryText,
//               item._id === selectedCategory && styles.selectedCategoryText,
//             ]}
//           >
//             {t(item.name)}
//           </Text>
//         </TouchableOpacity>
//       )}
//       showsHorizontalScrollIndicator={false}
//     />
//   );
// };

// // Product Types and Component
// interface Product {
//   _id: string;
//   category: string;
//   title: string;
//   description: string;
//   price: string;
//   images: string[];
// }

// interface ProductGridProps {
//   products: Product[];
// }

// const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
//   const { t } = useTranslation();
//   const CARD_WIDTH = (width - 48) / 2;

//   const renderProductCard = ({ item }: { item: Product }) => (
//     <TouchableOpacity style={styles.cardContainer}>
//       <View style={styles.card}>
//         <Image
//           source={{ uri: item.images[0] || "https://via.placeholder.com/150" }}
//           style={styles.cardImage}
//         />
//         <View style={styles.cardOverlay}>
//           <Text style={styles.cardTitle} numberOfLines={1}>
//             {t("Price")}: {item.price}
//           </Text>
//           <Text style={styles.cardDescription} numberOfLines={2}>
//             {item.description}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <FlatList
//       data={products}
//       renderItem={renderProductCard}
//       keyExtractor={(item) => item._id}
//       numColumns={2}
//       contentContainerStyle={styles.productGrid}
//     />
//   );
// };

// // Main Home Screen Component
// const HomeScreen: React.FC = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [loading, setLoading] = useState<boolean>(false);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get<{ categories: Category[] }>(
//         `${BASE_URL}/category`
//       );
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchProducts = async (categoryId: string) => {
//     setLoading(true);
//     try {
//       const endpoint =
//         categoryId === "all"
//           ? `${BASE_URL}/product`
//           : `${BASE_URL}/category/${categoryId}/product`;

//       const response = await axios.get<{ products: Product[] }>(endpoint);
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts("all");
//   }, []);

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId);
//     fetchProducts(categoryId);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Explore Categories</Text>

//       <CategoryList
//         categories={categories}
//         selectedCategory={selectedCategory}
//         onSelectCategory={handleCategorySelect}
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#6366f1" />
//       ) : (
//         <ProductGrid products={products} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//     paddingTop: 16,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#1f2937",
//     marginBottom: 20,
//     paddingHorizontal: 16,
//   },
//   categoryItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 6,
//     backgroundColor: "#fff",
//   },
//   selectedCategory: {
//     backgroundColor: "#6366f1",
//   },
//   categoryText: {
//     fontSize: 16,
//     color: "#4b5563",
//   },
//   selectedCategoryText: {
//     color: "#fff",
//   },
//   productGrid: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   cardContainer: {
//     width: (width - 48) / 2,
//     padding: 8,
//   },
//   card: {
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   cardImage: {
//     width: "100%",
//     height: 200,
//     resizeMode: "cover",
//   },
//   cardOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     padding: 10,
//   },
//   cardTitle: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   cardDescription: {
//     color: "white",
//     fontSize: 12,
//     marginTop: 5,
//   },
// });

// export default HomeScreen;

import { BASE_URL } from "@/utils/apiConfig";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SPACING = 12;
const CARD_WIDTH = (width - SPACING * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.6;
const CARD_IMAGE_HEIGHT = CARD_WIDTH * 1.1;

// Enhanced Color Palette
const COLORS = {
  background: "#F4F6F9",
  primary: "#5E72E4",
  // secondary: "#2DCECD",
  // text: "#32325D",
  lightGray: "#F6F9FC",
  white: "#FFFFFF",
  shadowColor: "#000000",
  // border: "#E8ECF2",
  accent: "#FFB800",
  // textLight: "#8A94A6",
  // primary: "#4A6CF7",
  primaryGradient: ["#4A6CF7", "#3B5AFE"] as const,
  secondary: "#FF6B6B",
  secondaryGradient: ["#FF6B6B", "#FF8E53"] as const,
  text: "#2D3436",
  textLight: "#636E72",
  shadow: "rgba(0, 0, 0, 0.1)",
  border: "#DFE6E9",
  success: "#00B894",
  warning: "#FFC312",
};

interface Category {
  _id: string;
  name: string;
}
interface Product {
  _id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  images: string[];
}

interface ProductGridProps {
  products: Product[];
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}
interface Category {
  _id: string;
  name: string;
}
interface Product {
  _id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  images: string[];
  createdAt: string;
}

interface ProductGridProps {
  products: Product[];
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ categories: Category[] }>(
        `${BASE_URL}/category`
      );
      setAllCategories([
        { _id: "all", name: "All" },
        ...response.data.categories,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryListContent}
    >
      {allCategories.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={[
            styles.categoryItem,
            selectedCategory === item._id && styles.selectedCategoryItem,
          ]}
          onPress={() => onSelectCategory(item._id)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === item._id && styles.selectedCategoryText,
            ]}
          >
            {t(item.name)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const EmptyProductList = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t("No Products Found")}</Text>
      <Text style={styles.emptySubtitle}>
        {t("Try adjusting your search to find what you're looking for")}
      </Text>
    </View>
  );
};

const ProductCard = ({ item }: { item: Product }) => {
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const redirectToDetails = (id: string) => {
    router.push(`/productDetails/${item._id}`);
  };
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPressIn={() => setIsPressed(true)}
      onPress={() => redirectToDetails(item._id)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={[styles.card, isPressed && styles.cardPressed]}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.images[0] || "https://via.placeholder.com/150",
            }}
            style={styles.image}
            resizeMode="contain"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.2)"]}
            style={styles.imageOverlay}
          />

          {/* Price Tag */}
          <View style={styles.priceContainer}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.priceTag}
            >
              <Text style={styles.priceText}>₹{item.price}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return <EmptyProductList />;
  }

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard item={item} />
  );

  const ListFooterComponent = () => (
    // Add padding at the bottom to ensure last items are fully visible
    <View style={{ height: SPACING * 6 }} />
  );

  const ListHeaderComponent = () => (
    // Add padding at the top for consistent spacing
    <View style={{ height: SPACING / 12 }} />
  );

  const ItemSeparatorComponent = () => <View style={{ height: SPACING }} />;

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews={Platform.OS === "android"}
      getItemLayout={(data, index) => ({
        length: CARD_HEIGHT + SPACING,
        offset: (CARD_HEIGHT + SPACING) * Math.floor(index / 2),
        index,
      })}
    />
  );
};

const HomeScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async (categoryId: string) => {
    setLoading(true);
    try {
      const endpoint =
        categoryId === "all"
          ? `${BASE_URL}/product`
          : `${BASE_URL}/category/${categoryId}/product`;

      const response = await axios.get<{ products: Product[] }>(endpoint);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchProducts(selectedCategory);
    }, [selectedCategory])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.screenTitle}>Explore Products</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ProductGrid products={products} />
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    ...Platform.select({
      ios: { letterSpacing: -0.7 },
      android: { letterSpacing: -0.5 },
    }),
  },
  categoryListContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginRight: 12,
    borderRadius: 30,
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.text,
    borderWidth: 1,
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productGridContent: {
    paddingHorizontal: 16,
  },
  productGridRow: {
    justifyContent: "space-between",
  },
  productCardContainer: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  productCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  productImage: {
    width: "100%",
    height: CARD_WIDTH * 1.3,
  },
  productCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  productCardDetails: {
    padding: 12,
  },
  productPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  productDescription: {
    color: COLORS.lightGray,
    fontSize: 14,
    marginTop: 4,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    marginTop: 10,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  gridContainer: {
    padding: SPACING,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 0,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    transform: [{ scale: 1 }],
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
    height: "100%",
  },
  priceContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  contentContainer: {
    flex: 1,
    gap: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 28,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
  },
  emptyTitle: {
    width: CARD_WIDTH,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    margin: 32,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeScreen;

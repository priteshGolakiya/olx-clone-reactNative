import { BASE_URL } from "@/utils/apiConfig";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
interface Category {
  _id: string;
  name: string;
  image?: string;
}

interface Item {
  _id: string;
  title: string;
  image?: string;
}

type DataType = Category[] | Item[];

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [data, setData] = useState<DataType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollY = new Animated.Value(0);

  // Reference to the categories FlatList for scrolling
  const categoriesListRef = useRef<FlatList>(null);

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await axios.get<{ categories: Category[] }>(
        `${BASE_URL}/category`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchData = async (categoryId: string): Promise<void> => {
    setLoading(true);
    try {
      let response;
      if (categoryId === "all") {
        response = await axios.get<{ categories: Category[] }>(
          `${BASE_URL}/category`
        );
        setData(response.data.categories);
      } else {
        response = await axios.get<{ products: Item[] }>(
          `${BASE_URL}/category/${categoryId}/product`
        );
        console.log("response.data.products::: ", response.data.products);
        setData(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(selectedCategory);
    setRefreshing(false);
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      fetchData("all");
    }, [])
  );

  const handleCategorySelect = (categoryId: string, index: number): void => {
    setSelectedCategory(categoryId);
    fetchData(categoryId);

    // Scroll the categories list to show the selected category
    categoriesListRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5, // Center the selected category
    });
  };

  // Find category index helper function
  const findCategoryIndex = (categoryId: string): number => {
    const allCategories = [
      { _id: "all", name: "All" } as Category,
      ...categories,
    ];
    return allCategories.findIndex((category) => category._id === categoryId);
  };

  const renderCard: ListRenderItem<Category | Item> = ({ item }) => {
    const isCategory = "name" in item;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          if (isCategory) {
            const index = findCategoryIndex(item._id);
            handleCategorySelect(item._id, index);
          }
        }}
      >
        <View
          style={[
            styles.card,
            isCategory && item._id === selectedCategory && styles.selectedCard,
          ]}
        >
          <Image
            source={{
              uri: item.image || "https://via.placeholder.com/150",
            }}
            style={styles.cardImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          >
            <Text style={styles.cardTitle} numberOfLines={2}>
              {isCategory ? t(item.name) : t(item.title)}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data: any, index: number) => ({
    length: 50, // Approximate height of category item
    offset: 50 * index,
    index,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Categories</Text>

      <View style={styles.categoriesWrapper}>
        <FlatList
          ref={categoriesListRef}
          data={[{ _id: "all", name: t("All") } as Category, ...categories]}
          horizontal
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                item._id === selectedCategory && styles.selectedCategory,
              ]}
              onPress={() => handleCategorySelect(item._id, index)}
            >
              <Text
                style={[
                  styles.categoryText,
                  item._id === selectedCategory && styles.selectedCategoryText,
                ]}
              >
                {t(item.name)}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          getItemLayout={getItemLayout}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <Animated.FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCard}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 20,
    paddingHorizontal: 16,
    letterSpacing: -0.5,
  },
  categoriesWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 6,
    marginVertical: 6,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: "#6366f1",
  },
  categoryText: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  cardContainer: {
    width: CARD_WIDTH,
    padding: 4,
  },
  card: {
    height: CARD_WIDTH * 1.2,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default HomeScreen;

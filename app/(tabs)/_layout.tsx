import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = SCREEN_WIDTH / 4;

interface CustomTabButtonProps {
  titleKey: string; // Changed to titleKey to use translation key
  icon: keyof typeof Feather.glyphMap;
  size: number;
  isSelected?: boolean;
  index: number;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  titleKey,
  icon,
  size,
  isSelected = false,
  index,
}) => {
  const { t } = useTranslation();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isSelected ? 1.1 : 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: isSelected ? -4 : 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  return (
    <View style={[styles.tabButtonContainer, { width: TAB_WIDTH }]}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ scale: scaleValue }, { translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            isSelected && styles.activeIconContainer,
          ]}
        >
          <Feather
            name={icon}
            size={18}
            color={isSelected ? "#FFFFFF" : "#64748B"}
          />
        </View>
        <Text
          style={[
            styles.tabButtonText,
            {
              color: isSelected ? "#2563eb" : "#64748B",
              fontWeight: isSelected ? "600" : "400",
            },
          ]}
        >
          {t(titleKey)} {/* Using translation */}
        </Text>
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Fix for TypeScript error with TouchableOpacity props
  const createTabBarButton = (
    props: any,
    titleKey: string,
    icon: keyof typeof Feather.glyphMap
  ) => (
    <TouchableOpacity
      {...props}
      style={{ flex: 1 }}
      delayLongPress={undefined} // Explicitly set to undefined instead of null
    >
      <CustomTabButton
        titleKey={titleKey}
        icon={icon}
        size={18}
        isSelected={props.accessibilityState?.selected}
        index={0}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: [
            styles.tabBar,
            {
              height: 70 + insets.bottom,
              paddingBottom: insets.bottom,
            },
          ],
          headerShown: false,
          tabBarShowLabel: false,
        }}
        initialRouteName="index"
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarButton: (props) => createTabBarButton(props, "home", "home"),
          }}
        />
        <Tabs.Screen
          name="myAds"
          options={{
            title: "MyAds",
            tabBarButton: (props) =>
              createTabBarButton(props, "My Ads", "shopping-bag"),
          }}
        />
        <Tabs.Screen
          name="sell"
          options={{
            title: "Sell",
            tabBarButton: (props) =>
              createTabBarButton(props, "Sell", "plus-circle"),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Account",
            tabBarButton: (props) =>
              createTabBarButton(props, "profile", "user"),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
  },
  tabButtonContainer: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  activeIconContainer: {
    backgroundColor: "#2563eb",
  },
  tabButtonText: {
    fontSize: 15,
    marginTop: 2,
  },
});

import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useRef, useEffect } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_WIDTH = SCREEN_WIDTH / 4;

interface CustomTabButtonProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  size: number;
  isSelected?: boolean;
  index: number;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  title,
  icon,
  size,
  isSelected = false,
  index,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isSelected ? 1.1 : 1, // Reduced scale effect
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: isSelected ? -4 : 0, // Reduced bounce height
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
            size={18} // Reduced icon size
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
          {title}
        </Text>
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: [
            styles.tabBar,
            {
              height: 70 + insets.bottom, // Reduced height
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
            tabBarButton: (props) => (
              <TouchableOpacity {...props} style={{ flex: 1 }}>
                <CustomTabButton
                  title="Home"
                  icon="home"
                  size={18}
                  isSelected={props.accessibilityState?.selected}
                  index={0}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="myAds"
          options={{
            title: "My Ads",
            tabBarButton: (props) => (
              <TouchableOpacity {...props} style={{ flex: 1 }}>
                <CustomTabButton
                  title="My Ads"
                  icon="shopping-bag"
                  size={18}
                  isSelected={props.accessibilityState?.selected}
                  index={1}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="sell"
          options={{
            title: "Sell",
            tabBarButton: (props) => (
              <TouchableOpacity {...props} style={{ flex: 1 }}>
                <CustomTabButton
                  title="Sell"
                  icon="plus-circle"
                  size={18}
                  isSelected={props.accessibilityState?.selected}
                  index={2}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Account",
            tabBarButton: (props) => (
              <TouchableOpacity {...props} style={{ flex: 1 }}>
                <CustomTabButton
                  title="Profile"
                  icon="user"
                  size={18}
                  isSelected={props.accessibilityState?.selected}
                  index={3}
                />
              </TouchableOpacity>
            ),
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
    height: 80, // Reduced height
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4, // Reduced padding
  },
  iconContainer: {
    width: 38, // Reduced width
    height: 38, // Reduced height
    borderRadius: 24, // Adjusted for new size
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  activeIconContainer: {
    backgroundColor: "#2563eb",
  },
  tabButtonText: {
    fontSize: 15, // Reduced font size
    marginTop: 2, // Reduced margin
  },
});

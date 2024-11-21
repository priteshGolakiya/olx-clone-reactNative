// import { View, Text } from "react-native";
// import React from "react";
// import { Stack, useRouter } from "expo-router";
// import { defaultStyles } from "@/styles";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { Ionicons } from "@expo/vector-icons";

// const FavoritesLayout = () => {
//   const router = useRouter();
//   return (
//     <View style={defaultStyles.container}>
//       <Stack>
//         <Stack.Screen
//           name="index"
//           options={{
//             title: "Profile",
//           }}
//         />
//         <Stack.Screen
//           name="editAddress"
//           options={{
//             presentation: "modal",
//             title: "Edit Address",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => router.back()}>
//                 <Ionicons name="close-outline" size={28} />
//               </TouchableOpacity>
//             ),
//           }}
//         />
//         <Stack.Screen
//           name="addAddress"
//           options={{
//             presentation: "modal",
//             title: "Add Address",
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => router.back()}>
//                 <Ionicons name="close-outline" size={28} />
//               </TouchableOpacity>
//             ),
//           }}
//         />
//       </Stack>
//     </View>
//   );
// };

// export default FavoritesLayout;

import { View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { defaultStyles } from "@/styles";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/store/hooks";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";

const ProfileLayout = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const isAdmin = user.role === "admin";
  const { t } = useTranslation();
  if (isAdmin) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{
              title: t("profile"),
              drawerLabel: t("profile"),
              drawerIcon: ({ size, color }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="users"
            options={{
              title: "Users Management",
              drawerLabel: "Users",
              drawerIcon: ({ size, color }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="product"
            options={{
              title: t("Product Management"),
              drawerLabel: t("products"),
              drawerIcon: ({ size, color }) => (
                <Ionicons name="cart-outline" size={size} color={color} />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    );
  }

  return (
    <View style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Profile",
          }}
        />
        <Stack.Screen
          name="editAddress"
          options={{
            presentation: "modal",
            title: "Edit Address",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-outline" size={28} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="addAddress"
          options={{
            presentation: "modal",
            title: "Add Address",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-outline" size={28} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </View>
  );
};

export default ProfileLayout;

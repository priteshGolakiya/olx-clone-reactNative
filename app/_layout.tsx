// import React, { useState } from "react";
// import { TouchableOpacity } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Stack } from "expo-router";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Provider } from "react-redux";
// import store, { persistor } from "@/store/store";
// import { PersistGate } from "redux-persist/integration/react";
// import "@/i18n";
// import { useTranslation } from "react-i18next";
// import { Ionicons } from "@expo/vector-icons";
// import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";

// const RootLayout = () => {
//   const { t } = useTranslation();
//   const [showLanguageSelector, setShowLanguageSelector] = useState(false);

//   // Create a header right component
//   const HeaderRight = () => (
//     <>
//       <TouchableOpacity
//         onPress={() => setShowLanguageSelector(true)}
//         style={{
//           padding: 8,
//           marginRight: 8,
//         }}
//       >
//         <Ionicons name="language" size={24} color="#007AFF" />
//       </TouchableOpacity>
//       <LanguageSelector
//         isVisible={showLanguageSelector}
//         onClose={() => setShowLanguageSelector(false)}
//       />
//     </>
//   );

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <GestureHandlerRootView style={{ flex: 1 }}>
//           <SafeAreaProvider>
//             <Stack
//               screenOptions={{
//                 headerShown: true,
//                 headerRight: () => <HeaderRight />,
//                 headerStyle: {
//                   backgroundColor: "#FFFFFF",
//                 },
//                 headerShadowVisible: false,
//                 headerTitleStyle: {
//                   fontSize: 18,
//                   fontWeight: "600",
//                 },
//               }}
//             >
//               <Stack.Screen
//                 name="(tabs)"
//                 options={{
//                   title: t("home"),
//                 }}
//               />
//               <Stack.Screen
//                 name="productDetails/[id]"
//                 options={{
//                   title: t("productDetails"),
//                 }}
//               />
//               <Stack.Screen
//                 name="login"
//                 options={{
//                   title: t("login"),
//                 }}
//               />
//               <Stack.Screen
//                 name="signUp"
//                 options={{
//                   title: t("signup"),
//                 }}
//               />
//             </Stack>
//           </SafeAreaProvider>
//         </GestureHandlerRootView>
//       </PersistGate>
//     </Provider>
//   );
// };

// export default RootLayout;

// import React, { useState } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Stack } from "expo-router";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Provider } from "react-redux";
// import store, { persistor } from "@/store/store";
// import { PersistGate } from "redux-persist/integration/react";
// import "@/i18n";
// import { useTranslation } from "react-i18next";
// import LanguageButton from "@/components/LanguageButton";
// import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
// import { Text, View } from "react-native";
// import { StatusBar } from "expo-status-bar";

// const RootLayout = () => {
//   const { t } = useTranslation();
//   const [showLanguageSelector, setShowLanguageSelector] = useState(false);

//   const HeaderRight = () => (
//     <View style={{ padding: 16 }}>
//       <LanguageButton onPress={() => setShowLanguageSelector(true)} />
//       <LanguageSelector
//         isVisible={showLanguageSelector}
//         onClose={() => setShowLanguageSelector(false)}
//       />
//     </View>
//   );

//   const HeaderCenter = () => (
//     <Text style={{ fontSize: 20, color: "black" }}>Store</Text>
//   );

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <GestureHandlerRootView style={{ flex: 1 }}>
//           <StatusBar style="auto" />
//           <SafeAreaProvider>
//             <Stack
//               screenOptions={{
//                 headerShown: true,
//                 headerRight: () => <HeaderRight />,
//                 headerLeft: () => <HeaderCenter />,
//                 headerStyle: {
//                   backgroundColor: "#FFFFFF",
//                 },
//                 headerShadowVisible: false,
//                 headerTitleStyle: {
//                   fontSize: 18,
//                   fontWeight: "600",
//                 },
//               }}
//             >
//               <Stack.Screen
//                 name="(tabs)"
//                 options={{
//                   headerTitle: () => <HeaderCenter />,
//                 }}
//               />
//               <Stack.Screen
//                 name="productDetails/[id]"
//                 options={{
//                   title: t("productDetails"),
//                 }}
//               />
//               <Stack.Screen
//                 name="login"
//                 options={{
//                   title: t("login"),
//                 }}
//               />
//               <Stack.Screen
//                 name="signUp"
//                 options={{
//                   title: t("signup"),
//                 }}
//               />
//             </Stack>
//           </SafeAreaProvider>
//         </GestureHandlerRootView>
//       </PersistGate>
//     </Provider>
//   );
// };

// export default RootLayout;

import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store, { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import LanguageButton from "@/components/LanguageButton";
import LanguageSelector from "@/components/LanguageSelector/LanguageSelector";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const RootLayout = () => {
  const { t } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const HeaderRight = () => (
    <View style={{ padding: 4 }}>
      <LanguageButton onPress={() => setShowLanguageSelector(true)} />
      <LanguageSelector
        isVisible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );

  const HeaderCenter = () => (
    <Text style={{ fontSize: 20, color: "black" }}>Store</Text>
  );

  const defaultScreenOptions: NativeStackNavigationOptions = {
    headerShown: true,
    title: "",
    headerRight: () => <HeaderRight />,
    headerLeft: () => <HeaderCenter />,
    headerStyle: {
      backgroundColor: "#FFFFFF",
    },
    headerShadowVisible: false,
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: "600" as const,
    },
  };

  const authScreenOptions: NativeStackNavigationOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: "#FFFFFF",
    },
    headerShadowVisible: false,
    headerTitleStyle: {
      fontSize: 24,
      fontWeight: "600" as const,
    },

    headerRight: undefined,
    headerLeft: undefined,

    headerTitleAlign: "center" as const,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <SafeAreaProvider>
            <Stack screenOptions={defaultScreenOptions}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="productDetails/[id]"
                options={{
                  ...authScreenOptions,
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  title: t("productDetails"),
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  ...authScreenOptions,
                  title: t("login"),
                }}
              />
              <Stack.Screen
                name="signUp"
                options={{
                  ...authScreenOptions,
                  title: t("signup"),
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;

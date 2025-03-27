import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "../assets/css/global.css";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Amiri: require("../assets/fonts/Amiri-Regular.ttf"),
    Arabic: require("../assets/fonts/arabic-font.ttf"),
    ScheherazadeNew: require("../assets/fonts/ScheherazadeNew-Regular.ttf"),
    Manrope: require("../assets/fonts/Manrope-VariableFont_wght.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                headerTitle: "",
                headerTitleStyle: {
                  fontFamily: "ScheherazadeNew",
                  fontSize: 24,
                  color: "#551c01",
                },
              }}
            />
            <Stack.Screen
              name="sourates/[id]/[en]"
              options={{
                headerShown: false,
                headerTitle: "",
              }}
            />
            <Stack.Screen
              name="pdf/[route]"
              options={{
                headerShown: true,
                headerTitle: "",
                headerTintColor: '#551c01'
              }}
            />
          </Stack>
        </View>
      </ThemeProvider>
    </Provider>
  );
}

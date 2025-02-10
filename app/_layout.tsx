import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "../assets/css/global.css";

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              // headerTitle: "بسير زمانك سر",
              headerTitle: "",
              headerTitleStyle: {
                fontFamily: "ScheherazadeNew",
                fontSize: 24,
                color: "#551c01",
              },
            }}
          />
          <Stack.Screen
            name="sourates/[id]"
            options={{
              headerShown: true,
              headerTitle: "",
              headerTintColor: 'green',
            }}
          />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "../assets/css/global.css";
import { Image, View } from "react-native";
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    ScheherazadeNew: require("../assets/fonts/ScheherazadeNew-Regular.ttf"),
    Manrope: require("../assets/fonts/Manrope-VariableFont_wght.ttf"),
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const LogoTitle = () => {
    return (
      <Image
        style={{ width: 35, height: 35, borderRadius: 20 }}
        source={require('../assets/images/icon.png')}
      />
    );
  }

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
        <View onLayout={onLayoutRootView} className="flex-1">
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                headerTitle: () => <LogoTitle />,
                headerTintColor: "#0a5c0a",
                headerTitleStyle: {
                  fontFamily: "Poppins",
                  fontSize: 24,
                  color: "#0a5c0a",
                },
              }}
            />
            <Stack.Screen
              name="hadiths/index"
              options={{
                headerShown: true,
                headerTitle: () => <LogoTitle />,
                headerBackTitleVisible: false,
                headerTintColor: "#0a5c0a",
                headerTitleStyle: {
                  fontFamily: "Poppins",
                  fontSize: 24,
                  color: "#0a5c0a",
                },
              }}
            />
            <Stack.Screen
              name="sourates/[id]/[en]"
              options={{
                headerShown: true,
                headerTitle: "",
                headerTintColor: '#0a5c0a',
                headerBackTitleVisible: false,
                headerTitleStyle: {
                  fontFamily: "Poppins",
                  fontWeight: "bold"
                },
              }}
            />
            <Stack.Screen
              name="pdf/[route]"
              options={{
                headerShown: true,
                headerTitle: "",
                headerBackTitleVisible: false,
                headerTintColor: '#0a5c0a',
                headerTitleStyle: {
                  fontFamily: "Poppins",
                },
              }}
            />
            <Stack.Screen
              name="favoris/[sourate]"
              options={{
                headerShown: true,
                headerTitle: "Mes favoris",
                headerBackTitleVisible: false,
                headerTintColor: '#0a5c0a',
                headerTitleStyle: {
                  fontFamily: "Poppins",
                },
              }}
            />
          </Stack>
          <Toast />
        </View>
      </ThemeProvider>
    </Provider>
  );
}

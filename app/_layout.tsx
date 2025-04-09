import {
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "../assets/css/global.css";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingSlider from "@/components/OnBoardingSlider";
import { Ionicons } from "@expo/vector-icons";
import MyDarkTheme from "@/components/MyDarkTheme";
import MyLightTheme from "@/components/MyLightTheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Vérifier si c'est la première ouverture de l'application
  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');

        if (hasLaunched === null) {
          // Si la clé n'existe pas, c'est la première ouverture
          // @ts-ignore
          setIsFirstLaunch(true);
        } else {
          // Si la clé existe, ce n'est pas la première ouverture
          // @ts-ignore
          setIsFirstLaunch(false);
        }
      } catch (error) {
        // En cas d'erreur, considérer qu'il ne s'agit pas de la première ouverture
        console.error('Erreur lors de la vérification du premier lancement:', error);
        // @ts-ignore
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkFirstLaunch();
  }, []);

  // Fonction appelée quand l'onboarding est terminé
  const completeOnboarding = async () => {
    try {
      // Enregistrer que l'application a déjà été lancée
      await AsyncStorage.setItem('hasLaunched', 'true');
      // @ts-ignore
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du premier lancement:', error);
    }
  };

  if (!loaded) {
    return null;
  }

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <View className="bg-white dark:bg-black px-8 py-6 rounded-2xl items-center space-y-4">
          <ActivityIndicator size="large" color="#388E3C" />
          <Text className="text-gray-700 font-medium text-center mt-2">
            Chargement en cours...
          </Text>
        </View>
      </View>
    );
  }

  // Afficher l'onboarding uniquement lors de la première ouverture
  if (isFirstLaunch) {
    return <OnboardingSlider onComplete={completeOnboarding} />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}>
        <View onLayout={onLayoutRootView} className="flex-1">
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                headerTitle: () => <LogoTitle />,
              }}
            />
            <Stack.Screen
              name="hadiths/index"
              options={{
                headerShown: true,
                headerTitle: () => <LogoTitle />,
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="sourates/[id]/[en]"
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: "",
                headerTintColor: colorScheme === 'dark' ? '#fff' : '#0a5c0a',
                headerBackTitleVisible: false,
                headerTitleStyle: {
                  fontFamily: "Poppins",
                  fontWeight: "bold"
                },
                headerLeft: () => (
                  <Pressable
                    onPress={() => navigation.navigate("(tabs)")}>
                    <Ionicons name="arrow-back" size={24} color={colorScheme == 'dark' ? '#fff' : "#0a5c0a"} />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="pdf/[route]"
              options={{
                headerShown: true,
                headerTitle: "",
                headerBackTitleVisible: false,
                headerTintColor: colorScheme === 'dark' ? '#fff' : '#0a5c0a',
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
                headerTintColor: colorScheme === 'dark' ? '#fff' : '#0a5c0a',
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
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import {Provider} from "react-redux";
import store from "@/redux/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Amiri: require('../assets/fonts/Amiri-Regular.ttf'),
        Arabic: require('../assets/fonts/arabic-font.ttf'),
        ScheherazadeNew: require('../assets/fonts/ScheherazadeNew-Regular.ttf'),
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
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    {/*<Stack.Screen name="(tabs)" options={{ headerShown: false }} />*/}
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="sourates" options={{ headerShown: false }} />
                    <Stack.Screen name="soufisme" options={{ headerShown: false }} />
                    <Stack.Screen name="qr" options={{ headerShown: false }} />
                    <Stack.Screen name="fiqh" options={{ headerShown: false }} />
                    <Stack.Screen name="hadith" options={{ headerShown: false }} />
                    <Stack.Screen name="aqidah" options={{ headerShown: false }} />
                    <Stack.Screen name="ayats" options={{ headerShown: false }} />
                    <Stack.Screen name="books" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ThemeProvider>
        </Provider>
    );
}

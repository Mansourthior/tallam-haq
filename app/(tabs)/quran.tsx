import { fetchSourates } from "@/redux/actions";
import { useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, ImageBackground, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { surahTranslations } from "../../utils/sourate-utils";
import { useNavigation } from "expo-router";

export default function QuranScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  // @ts-ignore
  const sourates = useSelector((state) => state.sourates.sourates);
  // @ts-ignore
  const loading = useSelector((state) => state.sourates.loading);
  // @ts-ignore
  const error = useSelector((state) => state.sourates.error);

  const getFrenchName = (name: string): string => {
    return surahTranslations[name] || name;
  };

  const openSourate = (englishName: string, sourate: number) => {
    // @ts-ignore
    navigation.navigate('sourates/[id]/[en]', {
      id: sourate,
      en: englishName
    });
  }

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchSourates());
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <View className="bg-white/80 px-8 py-6 rounded-2xl items-center space-y-4">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-700 font-medium text-center mt-2">
            Chargement en cours...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {

  }


  return (
    <View className="flex-1">
      <ImageBackground source={colorScheme === 'dark' ? require('../../assets/images/bg-dark.jpg') : require('../../assets/images/bg.jpg')} resizeMode="cover">
        <ScrollView className="px-4 py-4">
          {sourates.map((sourate: any) => (
            <Pressable
              key={sourate.number}
              onPress={() => openSourate(sourate.englishName, sourate.number)}
              className="mb-4 bg-white dark:bg-lime-900 rounded-xl shadow-sm shadow-amber-50 dark:shadow-amber-900 active:opacity-90"
            >
              <View className="p-4 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  {/* Number Circle */}
                  <View className="w-12 h-12 rounded-full bg-green-700 dark:bg-neutral-50 items-center justify-center mr-4">
                    <Text allowFontScaling={false} className="text-white dark:text-lime-700 text-lg font-bold">
                      {sourate.number}
                    </Text>
                  </View>

                  {/* Name Section */}
                  <View className="flex-1">
                    <Text allowFontScaling={false} className="font-[Poppins] text-lg font-bold text-gray-900 dark:text-white">
                      {sourate.englishName}
                    </Text>
                    <Text allowFontScaling={false} className="font-[Poppins] text-sm text-gray-600 dark:text-white">
                      {getFrenchName(sourate.englishName)}
                    </Text>
                  </View>
                </View>

                {/* Arabic Section */}
                <View className="items-end">
                  <Text className="font-[Poppins] text-2xl text-green-900 mb-2 font-sans dark:text-white">
                    {sourate.name}
                  </Text>
                  <View className="flex-row gap-2">
                    <View className="bg-green-100 px-2 py-1 rounded-full">
                      <Text allowFontScaling={false} className="font-[Poppins] text-xs text-green-800">
                        {sourate.numberOfAyahs} versets
                      </Text>
                    </View>
                    <View className="bg-green-100 px-2 py-1 rounded-full">
                      <Text allowFontScaling={false} className="font-[Poppins] text-xs text-green-800">
                        {sourate.revelationType === 'Meccan' ? 'Mecquoise' : 'Médinoise'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

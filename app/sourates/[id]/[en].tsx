import { fetchVerses } from "@/redux/actions";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, SafeAreaView, FlatList, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Verset from "@/components/Verset";
import souratesJson from '../../../assets/sourates.json';
import Toast from "react-native-toast-message";

export default function SourateScreen() {
    const navigation = useNavigation();
    const { id, en } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const dispatch = useDispatch();
    // @ts-ignore
    const verses = useSelector((state) => state.verses.verses);
    // @ts-ignore
    const name = useSelector((state) => state.verses.name);
    // @ts-ignore
    const loading = useSelector((state) => state.verses.loading);
    // @ts-ignore
    const error = useSelector((state) => state.verses.error);

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchVerses(id));
    }, [dispatch]);

    useEffect(() => {
        navigation.setOptions({ headerTitle: en });
    });

    const getSourate = (id: number) => {
        return souratesJson[id - 1]?.englishName;
    }


    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-green-900">
                <View className="bg-white/80 px-8 py-6 rounded-2xl items-center space-y-4">
                    <ActivityIndicator size="large" color="#388E3C" />
                    <Text className="text-green-700 font-medium text-center mt-2">
                        Chargement en cours...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
            {/* Liste des versets */}
            <FlatList
                data={verses}
                renderItem={({ item, index }) => <Verset sourateId={id} item={item} />}
                keyExtractor={item => item.numberInSurah}
                contentContainerClassName="py-4"
                indicatorStyle={"white"}
                ListHeaderComponent={
                    Number(id) == 1 ? <View></View> :
                        <View className="mx-6 mb-2 bg-green-100 p-2 rounded-full">
                            <Text allowFontScaling={false} className="text-2xl font-[Poppins] text-center text-green-900">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </Text>
                        </View>
                }
                ListFooterComponent={() => {
                    const nextId = Number(id) + 1;
                    const nextName = getSourate(nextId);

                    if (nextId > 114) return null;

                    return (
                        <Pressable
                            onPress={() => {
                                setTimeout(() => {
                                    // @ts-ignore
                                    navigation.push("sourates/[id]/[en]", { id: String(nextId), en: nextName });
                                }, 200);
                            }}
                            className="my-4 mx-24 py-2 px-6 bg-green-900 rounded-full"
                        >
                            <Text className="text-white text-center text-base font-[PoppinsBold]">
                                Suivante →
                            </Text>
                        </Pressable>
                    );
                }}
            />
            <Pressable
                // @ts-ignore
                onPress={() => navigation.navigate("favoris/[sourate]", { sourate: id })}
                className="absolute bottom-6 right-6 bg-emerald-950 dark:bg-white w-14 h-14 rounded-full justify-center items-center shadow-lg"
                style={{
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}
            >
                <Ionicons name="bookmark" size={24} color={colorScheme === 'dark' ? "#0a5c0a" : "#b7d5ac"} />
            </Pressable>

        </SafeAreaView>
    );
}

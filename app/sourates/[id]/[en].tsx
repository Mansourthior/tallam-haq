import Header from "@/components/Header";
import { fetchVerses } from "@/redux/actions";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, SafeAreaView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Verset from "@/components/Verset";

export default function SourateScreen() {
    const navigation = useNavigation();
    const { id, en } = useLocalSearchParams();
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
            <Pressable
                // @ts-ignore
                onPress={() => navigation.navigate("favoris/[sourate]", { sourate: id })}
                className="flex-row bg-green-800 py-2 px-4 rounded-full m-2 self-end"
            >
                <Ionicons
                    name={"bookmark"}
                    size={16}
                    color={"#b7d5ac"}
                />
                <Text className="text-white font-[Poppins] text-sm ml-1">Mes favoris</Text>
            </Pressable>
            <FlatList
                data={verses}
                renderItem={({ item, index }) => <Verset sourateId={id} item={item} index={index} />}
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
            />
        </SafeAreaView>
    );
}

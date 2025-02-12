import Header from "@/components/Header";
import { fetchVerses } from "@/redux/actions";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, SafeAreaView, FlatList, Share } from "react-native";
import { useDispatch, useSelector } from "react-redux";

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

    const onShare = async (s: string, v: string, message: string) => {
        try {
            const result = await Share.share({
                message: 's.' + s + ' : v.' + v + ' - ' + message +
                    "\n Découvrez cette superbe application ! 📱✨\nTéléchargez-la ici : https://example.com",
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log("Partagé via", result.activityType);
                } else {
                    console.log("Partage réussi !");
                }
            } else if (result.action === Share.dismissedAction) {
                console.log("Partage annulé");
            }
        } catch (error) {
            console.error("Erreur lors du partage :", error);
        }
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchVerses(id));
    }, [dispatch]);

    // @ts-ignore
    const renderVerse = ({ item, index }) => (
        <View className="bg-white p-4 mx-4 mb-3 rounded-lg shadow-sm shadow-amber-50 active:opacity-90">
            {/* En-tête verset */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="bg-amber-400 px-3 py-1 rounded-full">
                    <Text className="text-amber-900 text-sm font-semibold">{item.numberInSurah}</Text>
                </View>
                <View className="flex-row gap-3">
                    <Pressable onPress={() => onShare(id.toString(), item.numberInSurah, item.text)}>
                        <Ionicons name="share-social" size={24} color="#FFCA28" />
                    </Pressable>
                    <Pressable>
                        <Ionicons name="bookmark-outline" size={24} color="#FFCA28" />
                    </Pressable>
                </View>
            </View>

            {/* Contenu verset */}
            <View className="mb-4">
                <Text className="text-3xl font-[ScheherazadeNew] text-right leading-loose text-green-900">
                    {Number(id) != 1 && index === 0
                        ? item.text.substring(39)
                        : item.text}
                </Text>
            </View>

        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <View className="bg-white/80 px-8 py-6 rounded-2xl items-center space-y-4">
                    <ActivityIndicator size="large" color="#10b981" />
                    <Text className="text-gray-700 font-medium text-center mt-2">
                        Chargement en cours...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* En-tête */}
            <View className="px-3 py-3 bg-gray-50">
                <View className="flex-row items-center justify-between">
                    <Pressable onPress={navigation.goBack}>
                        <Ionicons name="arrow-back" size={24} color="#FFCA28" />
                    </Pressable>
                    <View>
                        <Text className="text-gray-900 text-xl font-semibold font-[Manrope]">{en}</Text>
                        <Text className="text-gray-700 font-[ScheherazadeNew] text-xl text-center">{name}</Text>
                    </View>
                    <Ionicons />
                </View>
            </View>

            {/* Liste des versets */}
            <FlatList
                data={verses}
                renderItem={renderVerse}
                keyExtractor={item => item.numberInSurah}
                contentContainerClassName="py-4"
                ListHeaderComponent={
                    Number(id) == 1 ? <View></View> :
                        <View className="mx-4 mb-4 bg-emerald-50 px-2 py-2 rounded-full">
                            <Text className="text-3xl font-sans text-center text-green-900">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </Text>
                        </View>
                }
            />
        </SafeAreaView>
    );
}

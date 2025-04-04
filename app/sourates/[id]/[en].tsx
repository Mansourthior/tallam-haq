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
                message: 'S.' + s + ' : V.' + v + ' - ' + message
                // + "\n Découvrez cette superbe application ! 📱✨\nTéléchargez-la ici : https://example.com",
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

    useEffect(() => {
        navigation.setOptions({ headerTitle: en });
    })

    // @ts-ignore
    const renderVerse = ({ item, index }) => (
        <View className="bg-white dark:bg-black p-4 mx-4 mb-2 rounded-lg active:opacity-90">
            {/* En-tête verset */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="bg-green-900 dark:bg-emerald-50 px-3 py-1 rounded-full">
                    <Text className="text-white dark:text-gray-900 text-sm font-semibold">{item.numberInSurah}</Text>
                </View>
                <View className="flex-row gap-3">
                    <Pressable onPress={() => onShare(id.toString(), item.numberInSurah, item.text + '\n' + item.fr)}>
                        <Ionicons name="share-social" size={24} color="#b7d5ac" />
                    </Pressable>
                </View>
            </View>

            {/* Contenu verset */}
            <View>
                <Text className="text-3xl font-[ScheherazadeNew] text-right leading-loose text-green-900 dark:text-green-100">
                    {![1, 9].includes(Number(id)) && index === 0
                        ? item.text.substring(39)
                        : item.text}
                </Text>
            </View>
            {/* Traduction verset */}
            <Text className="ml-2 text-lg font-[Poppins] text-gray-600 dark:text-gray-300">
                {item.fr}
            </Text>

        </View>
    );

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
                renderItem={renderVerse}
                keyExtractor={item => item.numberInSurah}
                contentContainerClassName="py-4"
                ListHeaderComponent={
                    Number(id) == 1 ? <View></View> :
                        <View className="mx-3 mb-4 bg-green-100 p-3 rounded-full">
                            <Text className="text-3xl font-[Poppins] text-center text-green-900">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </Text>
                        </View>
                }
            />
        </SafeAreaView>
    );
}

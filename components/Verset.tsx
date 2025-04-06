import { isFavorite, toggleFavorite } from "@/utils/favorites";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Share, Text, View } from "react-native";
import souratesJson from '../assets/sourates.json';
import { useNavigation } from "expo-router";
// @ts-ignore
export default function Verset({ sourateId, item, index, favorite = false }) {

    const navigation = useNavigation();
    const [isFav, setIsFav] = useState(false);
    const [sourateName, setSourateName] = useState("");

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
        if (favorite) {
            isFavorite(sourateId, item.verse).then(setIsFav);
        } else {
            isFavorite(sourateId, item.numberInSurah).then(setIsFav);
        }
    }, []);

    useEffect(() => {
        if (favorite) {
            setSourateName(getSourate(sourateId));
        }
    });

    const getSourate = (id: number) => {
        return souratesJson[id - 1].englishName;
    }

    const goToSourate = () => {
        // @ts-ignore
        navigation.navigate('sourates/[id]/[en]', { id: Number(sourateId), en: sourateName })
    }


    const handleToggle = async () => {
        if (favorite) {
            await toggleFavorite(sourateId, item.verse, item.text, item.fr, item.transliteration);
        } else {
            await toggleFavorite(sourateId, item.numberInSurah, item.text, item.fr, item.transliteration);
        }

        setIsFav(prev => !prev);
    };

    return (
        <View className="bg-white dark:bg-black p-4 mx-4 mb-2 rounded-lg active:opacity-90">
            {/* En-tête verset */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="bg-green-900 dark:bg-emerald-50 px-3 py-1 rounded-full">
                    {!favorite ?
                        <Text className="text-white dark:text-gray-900 text-sm font-semibold">{item.numberInSurah}</Text> :
                        <Text className="text-white dark:text-gray-900 text-sm font-semibold">{sourateName} -  Verset {item.verse}</Text>
                    }
                </View>
                <View className="flex-row gap-3">
                    {favorite ?
                        <Pressable onPress={goToSourate}>
                            <Ionicons
                                name={"enter"}
                                size={24}
                                color={"#b7d5ac"}
                            />
                        </Pressable> : <View></View>}
                    <Pressable onPress={() => handleToggle()}>
                        <Ionicons
                            name={isFav ? "bookmark" : "bookmark-outline"}
                            size={24}
                            color={isFav ? "#388E3C" : "#b7d5ac"}
                        />
                    </Pressable>
                    <Pressable onPress={() => onShare(sourateId.toString(), item.numberInSurah, item.text + '\n' + item.fr)}>
                        <Ionicons name="share-social" size={24} color="#b7d5ac" />
                    </Pressable>
                </View>
            </View>

            {/* Contenu verset */}
            <View>
                <Text className="text-3xl font-[ScheherazadeNew] text-right leading-loose text-green-900 dark:text-green-100">
                    {!favorite ?
                        (![1, 9].includes(Number(sourateId)) && item.numberInSurah == 1 ? item.text.substring(39) : item.text)
                        : (![1, 9].includes(Number(sourateId)) && item.verse == 1 ? item.text.substring(39) : item.text)}
                </Text>
            </View>
            <Text className="mb-2 ml-2 text-lg font-[Poppins] text-gray-800 dark:text-gray-500">
                {item.transliteration}
            </Text>
            {/* Traduction verset */}
            <Text className="ml-2 text-lg font-[Poppins] text-gray-600 dark:text-gray-300">
                {item.fr}
            </Text>

        </View>
    );
}
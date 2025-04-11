import { isFavorite, toggleFavorite } from "@/utils/favorites";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Share, Text, View } from "react-native";
import souratesJson from '../assets/sourates.json';
import { setShareViewRef, onShare } from "@/utils/share";
import { assets } from "@/assets/js/assets";

// @ts-ignore
export default function Verset({ sourateId, item, favorite = false }) {

    const [isFav, setIsFav] = useState(false);
    const [sourateName, setSourateName] = useState("");
    const localShareRef = useRef(null);

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

    const handleToggle = async () => {
        if (favorite) {
            await toggleFavorite(sourateId, item.verse, item.text, item.fr, item.transliteration);
        } else {
            await toggleFavorite(sourateId, item.numberInSurah, item.text, item.fr, item.transliteration);
        }

        setIsFav(prev => !prev);
    };

    const handleShare = () => {
        // Mettre à jour la référence globale avec la référence de ce verset spécifique
        setShareViewRef(localShareRef.current);
        // Puis déclencher le partage
        onShare();
    };

    const verseNumber = favorite ? item.verse : item.numberInSurah;
    const verseText = favorite ?
        (![1, 9].includes(Number(sourateId)) && item.verse == 1 ? item.text.substring(39) : item.text) :
        (![1, 9].includes(Number(sourateId)) && item.numberInSurah == 1 ? item.text.substring(39) : item.text);

    return (
        // @ts-ignore
        <>
            <View className="bg-white dark:bg-lime-950 p-4 mx-4 mb-2 rounded-lg active:opacity-90">
                {/* En-tête verset */}
                <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-green-900 dark:bg-emerald-50 px-3 py-1 rounded-full">
                        <Text className="text-white dark:text-gray-900 text-sm font-semibold">
                            {favorite ? `${sourateName} - Verset ${item.verse}` : item.numberInSurah}
                        </Text>
                    </View>
                    <View className="flex-row gap-3">
                        <Pressable onPress={() => handleToggle()}>
                            <Ionicons
                                name={isFav ? "bookmark" : "bookmark-outline"}
                                size={24}
                                color={isFav ? "#388E3C" : "#b7d5ac"}
                            />
                        </Pressable>
                        <Pressable onPress={handleShare}>
                            <Ionicons name="share-social" size={24} color="#b7d5ac" />
                        </Pressable>
                    </View>
                </View>

                {/* Contenu verset */}
                <View>
                    <Text className="text-3xl font-[ScheherazadeNew] text-right leading-loose text-green-900 dark:text-white">
                        {verseText}
                    </Text>
                </View>
                <Text className="mb-2 ml-2 text-lg font-[Poppins] text-emerald-800">
                    {item.transliteration}
                </Text>
                {/* Traduction verset */}
                <Text className="ml-2 text-lg font-[Poppins] text-gray-600 dark:text-gray-300">
                    {item.fr}
                </Text>

            </View>

            <View
                collapsable={false}
                ref={localShareRef}
                className="absolute left-[-1000] top-[-1000] w-[320px] bg-gradient-to-b from-green-50 to-white p-6 rounded-2xl shadow-lg"
                style={{ backgroundColor: 'white' }}
            >
                {/* En-tête avec logo et nom de l'application */}
                <View className="flex-row items-center mb-4 border-b border-green-200 pb-3">
                    <Image
                        source={assets.icon}
                        className="w-8 h-8 rounded-full"
                        resizeMode="contain"
                    />
                    <Text allowFontScaling={false} className="text-lime-950 font-[Poppins] text-lg font-bold ml-2">
                        Taraqqi
                    </Text>
                </View>

                {/* Information de la sourate */}
                <View className="flex-row justify-between items-center mb-3">
                    <View className="rounded-full bg-green-100 px-3 py-1">
                        <Text className="text-green-900 text-xs font-bold">
                            Sourate {sourateId} • Verset {verseNumber}
                        </Text>
                    </View>
                </View>

                {/* Texte arabe avec décoration */}
                <View className="bg-green-50 rounded-lg p-4 mb-4">
                    <View className="absolute -top-1 -left-1 w-6 h-6 bg-green-600 rounded-br-lg opacity-50" />
                    <Text allowFontScaling={false} className="text-xl font-[ScheherazadeNew] text-right leading-loose text-green-900">
                        {verseText}
                    </Text>
                </View>

                {/* Translittération avec bordure élégante
                <View className="border-l-4 border-green-200 pl-3 mb-3">
                    <Text allowFontScaling={false} className="text-emerald-800 text-base font-[Poppins]">
                        {item.transliteration}
                    </Text>
                </View> */}

                {/* Traduction avec bordure élégante */}
                <View className="border-l-4 border-green-300 pl-3 mb-4">
                    <Text allowFontScaling={false} className="text-gray-700 text-base font-[Poppins]">
                        {item.fr}
                    </Text>
                </View>

            </View>
        </>

    );
}
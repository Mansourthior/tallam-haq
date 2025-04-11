import { onShare, setShareViewRef } from "@/utils/share-hadith";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { assets } from '../assets/js/assets';
import { copyToClipboard } from "@/utils/copy-to-clipboard";

// @ts-ignore
export default function Hadith({ hadith }) {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();

    return (
        // @ts-ignore
        <>
            {/* --- Composant principal --- */}
            <View className="bg-lime-50 dark:bg-[#0B0F0E] rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
                <View>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text allowFontScaling={false} className="text-stone-800 dark:text-gray-300 font-[Poppins] text-xl font-bold">
                            Hadith du jour
                        </Text>
                        <Pressable
                            // @ts-ignore
                            onPress={() => navigation.navigate("hadiths/index")}
                            className="flex-row bg-emerald-950 py-2 px-4 rounded-full m-2 self-end"
                        >
                            <Ionicons name={"enter"} size={14} color={"#b7d5ac"} />
                            <Text className="text-white dark:text-lime-100 font-[PoppinsBold] text-xs ml-1">Voir hadiths</Text>
                        </Pressable>

                        <View className="flex-row gap-2">
                            <Pressable
                                onPress={() =>
                                    copyToClipboard(`${hadith?.hadith_text_ar}\n\n${hadith?.hadith_text}\n${hadith?.grade}\n${hadith?.takhrij}
                                \n\n=== Taraqqi ===`)}>
                                <Ionicons name="copy" size={24} color={colorScheme == 'dark' ? "#e5f19b" : "#b7d5ac"} />
                            </Pressable>
                            <Pressable onPress={() => onShare()}>
                                <Ionicons name="share-social" size={24} color={colorScheme == 'dark' ? "#e5f19b" : "#b7d5ac"} />
                            </Pressable>
                        </View>
                    </View>

                    <Text allowFontScaling={false} className="font-[Poppins] text-3xl pt-4 text-right text-lime-800 dark:text-white">
                        {hadith?.hadith_text_ar}
                    </Text>
                    <Text allowFontScaling={false} className="text-lg dark:text-gray-300 mt-2 font-[Poppins] text-stone-950">
                        {hadith?.hadith_text}
                    </Text>

                    <View className="flex items-end mt-2 gap-2">
                        <View className="bg-emerald-950 px-2 py-1 rounded-lg">
                            <Text allowFontScaling={false} className="text-white dark:text-lime-100 text-sm font-[PoppinsBold]">
                                {hadith?.grade}
                            </Text>
                        </View>
                        <View className="bg-emerald-950 px-2 py-1 rounded-lg">
                            <Text allowFontScaling={false} className="text-white dark:text-lime-100 text-sm font-[PoppinsBold]">
                                {hadith?.takhrij}
                            </Text>
                        </View>
                    </View>
                </View>
            </View >

            {/* --- Vue invisible à capturer --- */}
            <View
                collapsable={false}
                ref={setShareViewRef}
                className="absolute left-[-1000] top-[-1000] w-[320px] bg-white p-5 rounded-2xl items-center"
            >
                <Image source={assets.icon} className="w-16 h-16 mb-2 rounded-full" resizeMode="contain" />
                <Text allowFontScaling={false} className="text-green-900 font-[Poppins] text-xl font-bold mb-2">
                    Taraqqi
                </Text>
                <Text allowFontScaling={false} className="text-lime-700 text-2xl text-right font-[Poppins]">
                    {hadith?.hadith_text_ar}
                </Text>
                <Text allowFontScaling={false} className="text-stone-800 text-base mt-2 font-[Poppins] text-left">
                    {hadith?.hadith_text}
                </Text>
                <View className="flex-row gap-2 mt-2 bg-green-950 rounded-full">
                    <Text className="text-white px-2 py-1 text-xs font-[PoppinsBold]">
                        {hadith?.grade} | {hadith?.takhrij}
                    </Text>
                </View>
            </View>
        </>
    );
}

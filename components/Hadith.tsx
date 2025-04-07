import { onShare } from "@/utils/share-hadith";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";

// @ts-ignore
export default function Hadith({ hadith }) {

    const navigation = useNavigation();

    return (
        <View className="bg-slate-50 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
            <View>
                <View className="flex-row justify-between items-center mb-4">
                    <Text allowFontScaling={false} className="text-stone-800 font-[Poppins] text-xl font-bold">
                        Hadith du jour
                    </Text>
                    <Pressable
                        // @ts-ignore
                        onPress={() => navigation.navigate("hadiths/index")}
                        className="flex-row bg-green-800 py-2 px-4 rounded-full m-2 self-end"
                    >
                        <Ionicons
                            name={"enter"}
                            size={14}
                            color={"#b7d5ac"}
                        />
                        <Text className="text-white font-[PoppinsBold] text-xs ml-1">Voir hadiths</Text>
                    </Pressable>
                    <View className="flex-row gap-2">
                        <Pressable onPress={() => onShare(hadith)}>
                            <Ionicons name="share-social" size={24} color="#b7d5ac" />
                        </Pressable>
                    </View>
                </View>

                <Text allowFontScaling={false} className="font-[Poppins] text-3xl pt-4 text-right text-lime-700">
                    {hadith?.hadith_text_ar}
                </Text>
                <Text allowFontScaling={false} className="text-lg mt-2 font-[Poppins] text-stone-950">
                    {hadith?.hadith_text}
                </Text>
                <View className="flex items-end mt-2 gap-2">
                    <View className="bg-lime-700 px-2 py-1 rounded-lg">
                        <Text allowFontScaling={false} className="text-white text-sm font-[PoppinsBold]">
                            {hadith?.grade}
                        </Text>
                    </View>
                    <View className="bg-lime-700 px-2 py-1 rounded-lg">
                        <Text allowFontScaling={false} className="text-white text-sm font-[PoppinsBold]">
                            {hadith?.takhrij}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
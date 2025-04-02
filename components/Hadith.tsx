import { Text, View } from "react-native";

// @ts-ignore
export default function Hadith({ hadith }) {

    return (
        <View className="bg-slate-50 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
            <View>
                <Text allowFontScaling={false} className="text-stone-800 font-[Poppins] text-lg font-bold mb-4">
                    Hadith du jour
                </Text>
                <Text className="font-[Poppins] text-2xl text-right text-lime-700">
                    {hadith?.arabic}
                </Text>
                <Text className="text-lg mt-2 font-[Poppins] text-stone-950">
                    {hadith?.french}
                </Text>
            </View>
        </View>
    );
}
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Share, Text, View } from "react-native";

// @ts-ignore
export default function Hadith({ hadith }) {


    const onShare = async (hadith: any) => {
        try {
            const result = await Share.share({
                message: hadith.hadith_text_ar + '\n\n\n' +
                    hadith.hadith_text + ' ' + hadith.grade + ' ' + hadith.takhrij
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

    return (
        <View className="bg-slate-50 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
            <View>
                <View className="flex-row justify-between items-center mb-4">
                    <Text allowFontScaling={false} className="text-stone-800 font-[Poppins] text-xl font-bold">
                        Hadith du jour
                    </Text>
                    <View className="flex-row gap-3">
                        <Pressable onPress={() => onShare(hadith)}>
                            <Ionicons name="share-social" size={24} color="#b7d5ac" />
                        </Pressable>
                    </View>
                </View>

                <Text allowFontScaling={false} className="font-[Poppins] text-3xl pt-4 text-right text-lime-700">
                    {hadith?.hadith_text_ar}
                </Text>
                <Text allowFontScaling={false} className="text-lg mt-2 font-[Poppins] text-stone-950">
                    {hadith?.hadith_text + ' '}
                    {hadith?.grade + ' '}
                    {hadith?.takhrij}
                </Text>
            </View>
        </View>
    );
}
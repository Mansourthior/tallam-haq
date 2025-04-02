import { openLink } from "@/utils/link-utils";
import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Telegram() {
    return (
        <View className="bg-lime-700 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
            <View className="mb-4">
                <Text allowFontScaling={false} className="text-white text-lg font-bold font-[Poppins]">
                    Nos chaînes Télégram
                </Text>
                <Text allowFontScaling={false} className="text-gray-50 text-sm font-[Poppins]">
                    Cliquez pour ouvrir - Scrollez horizontalement
                </Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                className="flex-row"
            >
                {[
                    { name: "Jawahirul Mahaani", url: "https://t.me/+d1eGCL7PRONlZmI0" },
                    { name: "Rimah", url: "https://t.me/+3Pb8DAVGsyg5YTg0" },
                    { name: "Waqaf Sunnah", url: "https://t.me/+uWaq1qWnWyAwNWI0" },
                    { name: "Târikh Makgni", url: "https://t.me/HISTOIRE_SUNU_MAKGNI" },
                    { name: "Wahabisme", url: "https://t.me/siira_wahhabisme" },
                ].map((channel, index) => (
                    <Pressable
                        key={index}
                        onPress={() => openLink(channel.url)}
                    >
                        <View className="items-center mx-2">
                            <View className="flex flex-row gap-2 bg-amber-100 px-2 py-1 rounded-full">
                                <Feather name="link" size={16} color="#FF6F00" />
                                <Text allowFontScaling={false} className="text-lime-800 text-sm font-[PoppinsBold] uppercase">
                                    {channel.name}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
import { openLink } from "@/utils/link-utils";
import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import youtubeJson from '../assets/youtube.json';

export default function Youtube() {
    return (
        <View className="bg-lime-950 rounded-3xl mx-auto p-6 mt-4 mb-4 shadow-lg w-11/12">
            <View className="mb-4">
                <Text allowFontScaling={false} className="text-white text-xl font-bold font-[Poppins]">
                    Nos chaînes Youtube
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
                {youtubeJson.map((channel, index) => (
                    <Pressable
                        key={index}
                        onPress={() => openLink(channel.url)}
                    >
                        <View className="items-center mx-2">
                            <View className="flex flex-row gap-2 bg-amber-100 px-2 py-1 rounded-full">
                                <Feather name="link" size={16} color="#FF6F00" />
                                <Text allowFontScaling={false} className="text-lime-800 font-[PoppinsBold] text-sm uppercase">
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
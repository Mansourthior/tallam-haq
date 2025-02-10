import Header from "@/components/Header";
import { fetchVerses } from "@/redux/actions";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function SourateScreen() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();

    const [fontSize, setFontSize] = useState(28);
    const [lineHeight, setLineHeight] = useState(60);

    const dispatch = useDispatch();
    // @ts-ignore
    const verses = useSelector((state) => state.verses.verses);
    // @ts-ignore
    const name = useSelector((state) => state.verses.name);
    // @ts-ignore
    const loading = useSelector((state) => state.verses.loading);
    // @ts-ignore
    const error = useSelector((state) => state.verses.error);
    const increaseFontSize = () => setFontSize((prev) => prev + 2);
    const decreaseFontSize = () => setFontSize((prev) => prev - 2);

    const increaseLineHeight = () => setLineHeight((prev) => prev + 2);
    const decreaseLineHeight = () => setLineHeight((prev) => prev - 2);

    const increaseParams = () => {
        increaseFontSize();
        increaseLineHeight();
    };

    const decreaseParams = () => {
        decreaseFontSize();
        decreaseLineHeight();
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchVerses(id));
    }, [dispatch]);

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
        <View className="flex-1 bg-white">
            <Text> {name} - {id} </Text>
            {/* <View className="flex-row justify-end px-4 py-2 border-b border-gray-200 bg-white">
                <Pressable onPress={decreaseParams} className="p-2 ml-2 bg-red-200 rounded-lg">
                    <FontAwesome6 name="magnifying-glass-minus" size={18} color="maroon" />
                </Pressable>
                <Pressable onPress={increaseParams} className="p-2 ml-2 bg-red-200 rounded-lg">
                    <FontAwesome6 name="magnifying-glass-plus" size={18} color="maroon" />
                </Pressable>
            </View> */}

            {/* Contenu */}
            {/* <ScrollView className="flex-1 p-4">
                {verses.map((verse: any, index: number) => (
                    <View key={verse.number} className="bg-white rounded-2xl p-4 mb-4 shadow-md">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="w-8 h-8 bg-red-200 rounded-full flex justify-center items-center">
                                <Text className="text-red-700 font-bold">{index + 1}</Text>
                            </View>
                        </View>
                        <Text className="text-right pt-4 mb-2 font-[ScheherazadeNew] text-gray-900" style={{ fontSize, lineHeight }}>
                            {Number(id) != 1 && index === 0 ? verse.text.substring(40) : verse.text}
                        </Text>
                    </View>
                ))}
            </ScrollView> */}
        </View>
    );
}

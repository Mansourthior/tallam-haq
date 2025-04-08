import { openLink } from "@/utils/link-utils";
import { Feather, Ionicons } from "@expo/vector-icons";
import { FlatList, Modal, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import telegramJson from '../assets/telegram.json';
import { useState } from "react";

export default function Telegram() {
    const [modalVisible, setModalVisible] = useState(false);

    // Nombre de canaux à afficher initialement
    const initialDisplayCount = 3;

    // Canaux à afficher dans la vue principale
    const displayedChannels = telegramJson.slice(0, initialDisplayCount);

    // Canaux supplémentaires à afficher dans la modale
    const additionalChannels = telegramJson.length > initialDisplayCount ?
        telegramJson.slice(initialDisplayCount) : [];


    return (
        <View className="bg-lime-700 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
            <View className="mb-4">
                <Text allowFontScaling={false} className="text-white text-xl font-bold font-[Poppins]">
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
                {displayedChannels.map((channel, index) => (
                    <Pressable
                        key={index}
                        onPress={() => openLink(channel.url)}
                    >
                        <View className="items-center mx-2">
                            <View className="flex flex-row gap-2 bg-amber-100 px-2 py-1 rounded-full">
                                <Feather name="link" size={16} color="#FF6F00" />
                                <Text allowFontScaling={false} className="font-[Poppins] text-lime-800 text-sm font-bold uppercase">
                                    {channel.name}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            {additionalChannels.length > 0 && (
                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="mt-4 self-center"
                >
                    <View className="flex flex-row items-center bg-lime-900 px-3 py-1 rounded-full">
                        <Feather name="plus" size={16} color="#fff" />
                        <Text className="text-white text-sm font-bold ml-1">
                            Voir plus
                        </Text>
                    </View>
                </Pressable>
            )}

            {/* Modale pour afficher tous les canaux supplémentaires */}
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-white dark:bg-black">
                    <View className="items-center justify-center p-4">
                        <Text allowFontScaling={false} className="text-lg text-green-900 dark:text-white font-[PoppinsBold]">
                            Tous les canaux
                        </Text>
                    </View>

                    <FlatList
                        data={telegramJson}
                        renderItem={({ item, index }) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    openLink(item.url);
                                    setModalVisible(false);
                                }}
                                className="mb-4 bg-white dark:bg-lime-900 rounded-xl shadow-amber-50 active:opacity-90"
                            >
                                <View className="p-4 flex-row justify-between items-center">
                                    <View className="flex-row gap-4 items-center flex-1">

                                        <Feather name="link" size={24} color="#b7d5ac" />

                                        <View className="flex-1">
                                            <Text allowFontScaling={false} className="font-[Poppins] text-green-800 dark:text-white">
                                                {item.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Ionicons
                                            name={"enter"}
                                            size={18}
                                            color={"#b7d5ac"}
                                        />
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 16 }}
                    />

                    <Pressable onPress={() => setModalVisible(false)} className="bg-green-900 p-4 m-4 rounded-xl">
                        <Text className="font-[Poppins] text-white text-center font-bold">Fermer</Text>
                    </Pressable>
                </SafeAreaView>
            </Modal>
        </View>
    );
}
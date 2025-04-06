import React, { useState } from 'react';
import { Modal, FlatList, Text, TouchableOpacity, View, SafeAreaView, ScrollView, useColorScheme, TextInput, Pressable } from 'react-native';
import hadithsJson from '../../assets/hadiths.json';
import { Feather, Ionicons } from '@expo/vector-icons';
import { HighlightedText } from '@/components/HighlightedText';
import { onShare } from '@/utils/share-hadith';

export default function HadithScreen() {
    const colorScheme = useColorScheme();
    const [selectedHadith, setSelectedHadith] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    const openModal = (hadith: any) => {
        setSelectedHadith(hadith);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedHadith(null);
    };

    const filteredHadiths = hadithsJson.filter(hadith =>
        hadith.title.toLowerCase().includes(search.toLowerCase()) ||
        hadith.categories.some(cat => cat.toLowerCase().includes(search.toLowerCase()))
    );


    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="p-4 bg-transparent dark:bg-transparent">
                {/* Barre de recherche */}
                <View className="flex-row items-center rounded-full p-2">
                    <Feather name="search" size={20} color={colorScheme === 'dark' ? '#fff' : '#134200'} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 dark:text-white"
                        placeholder="Rechercher un mot ou une catégorie"
                        placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#134200'}
                        placeholderClassName="font-[Poppins]"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>
            <FlatList
                data={filteredHadiths}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => openModal(item)}
                        className="bg-green-100 dark:bg-gray-800 p-4 mb-4 rounded-xl"
                    >
                        <Text className="text-base font-[Poppins-SemiBold] text-gray-900 dark:text-white mb-2" numberOfLines={2}>
                            <HighlightedText text={item.title} search={search} />
                        </Text>

                        <Text className="text-sm text-gray-700 dark:text-gray-300 mb-2" numberOfLines={3}>
                            <HighlightedText text={item.hadith_text} search={search} />
                        </Text>

                        {/* Badges des catégories */}
                        <View className="flex-row flex-wrap gap-2 mb-2">
                            {item.categories?.map((category, index) => (
                                <View
                                    key={index}
                                    className="bg-green-200 dark:bg-green-900 px-2 py-1 rounded-full"
                                >
                                    <Text className="text-xs text-green-800 dark:text-green-200">
                                        {category}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Référence + Authenticité */}
                        <View className="flex-row justify-between mt-2 flex-wrap">
                            <Text className="text-xs text-gray-600 dark:text-gray-400 italic">
                                {item.takhrij}
                            </Text>
                            <Text className="text-xs text-green-700 dark:text-green-300">
                                {item.grade}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <SafeAreaView className="flex-1 bg-white dark:bg-black">
                    <Pressable
                        // @ts-ignore
                        onPress={() => onShare(selectedHadith)}
                        className="flex-row bg-green-800 py-2 px-4 rounded-full m-2 self-end"
                    >
                        <Ionicons
                            name={"share-social"}
                            size={18}
                            color={"#b7d5ac"}
                        />
                        <Text className="text-white font-[Poppins] text-sm ml-1">Partager</Text>
                    </Pressable>
                    <ScrollView className="p-4">
                        <Text className="text-xl font-bold mb-2 text-green-900 dark:text-white">Français</Text>
                        <Text className="text-base mb-4 text-gray-900 dark:text-gray-200">{selectedHadith?.hadith_text}</Text>

                        <Text className="text-xl font-bold mb-2 text-green-900 dark:text-white">Arabe</Text>
                        <Text className="text-lg mb-4 text-right text-gray-900 dark:text-gray-200">{selectedHadith?.hadith_text_ar}</Text>

                        <Text className="text-base mb-2 text-gray-600 dark:text-gray-400">Niveau : {selectedHadith?.grade}</Text>
                        <Text className="text-base text-gray-600 dark:text-gray-400">Source : {selectedHadith?.takhrij}</Text>
                    </ScrollView>

                    <TouchableOpacity onPress={closeModal} className="bg-green-700 p-4 m-4 rounded-xl">
                        <Text className="text-white text-center font-bold">Fermer</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

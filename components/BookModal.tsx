// components/BookModal.jsx
import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BookItem from './BookItem';

// @ts-ignore
const BookModal = ({ categoryName, books, searchQuery, setSearchQuery, loading, favorites, colorScheme, onClose, onBookOpen, onToggleFavorite }) => {
    return (
        <>
            <View className="items-center justify-center p-4">
                <Text allowFontScaling={false} className="text-lg text-green-900 dark:text-white font-[PoppinsBold]">
                    {categoryName}
                </Text>
            </View>

            <View className="p-4 bg-transparent dark:bg-transparent">
                <View className="flex-row items-center rounded-full px-4 py-2">
                    <Feather name="search" size={20} color={colorScheme === 'dark' ? '#fff' : '#134200'} />
                    <TextInput
                        className="flex-1 ml-2 text-gray-900 dark:text-white"
                        placeholder="Rechercher un PDF"
                        placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#134200'}
                        placeholderClassName="font-[Poppins]"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={books}
                renderItem={({ item }) => (
                    <BookItem
                        book={item}
                        loading={loading === item.id}
                        isFavorite={favorites.includes(item.id)}
                        onPress={() => onBookOpen(item.link, item.title, item.id)}
                        onToggleFavorite={() => onToggleFavorite(item.id)}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 16 }}
            />

            <TouchableOpacity onPress={onClose} className="bg-emerald-950 p-4 m-4 rounded-xl">
                <Text className="font-[Poppins] text-white text-center font-bold">Fermer</Text>
            </TouchableOpacity>
        </>
    );
};

export default BookModal;
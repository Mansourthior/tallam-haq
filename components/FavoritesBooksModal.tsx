// components/FavoritesModal.jsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import BookItem from './BookItem';
import { Feather, Ionicons } from '@expo/vector-icons';

// @ts-ignore
const FavoritesBooksModal = ({ favorites, books, searchQuery, setSearchQuery, loading, colorScheme, onClose, onBookOpen, onToggleFavorite }) => {
    // Filtrer tous les livres pour ne garder que les favoris
    // @ts-ignore
    const favoriteBooks = books.filter(book => favorites.includes(book.id));

    // @ts-ignore
    const filteredPdfList = favoriteBooks?.filter(pdf =>
        pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 p-4 bg-gray-50 dark:bg-black">
            <View className="items-center justify-center p-4">
                <Text allowFontScaling={false} className="text-lg text-green-900 dark:text-white font-[PoppinsBold]">
                    Mes Favoris
                </Text>
            </View>
            {favoriteBooks.length > 0 ?
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
                </View> : <></>}

            {favoriteBooks.length > 0 ? (
                <FlatList
                    data={filteredPdfList}
                    renderItem={({ item }) => (
                        <BookItem
                            book={item}
                            loading={loading === item.id}
                            isFavorite={true}
                            onPress={() => onBookOpen(item.link, item.title, item.id)}
                            onToggleFavorite={() => onToggleFavorite(item.id)}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 16 }}
                />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Ionicons name={"bookmarks"} size={80} color={"#b7d5ac"} />
                    <Text className="mt-4 text-lg font-[Poppins] text-center text-green-900 dark:text-white">
                        La liste de favoris est vide
                    </Text>
                </View>
            )}

            <TouchableOpacity onPress={onClose} className="bg-emerald-950 p-4 m-4 rounded-xl">
                <Text className="font-[Poppins] text-white text-center font-bold">Fermer</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FavoritesBooksModal;
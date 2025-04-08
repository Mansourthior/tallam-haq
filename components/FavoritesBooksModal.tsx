// components/FavoritesModal.jsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import BookItem from './BookItem';

// @ts-ignore
const FavoritesBooksModal = ({ favorites, books, loading, onClose, onBookOpen, onToggleFavorite }) => {
    // Filtrer tous les livres pour ne garder que les favoris
    // @ts-ignore
    const favoriteBooks = books.filter(book => favorites.includes(book.id));

    return (
        <SafeAreaView className="flex-1 p-4 bg-gray-50 dark:bg-black">
            <View className="items-center justify-center p-4">
                <Text allowFontScaling={false} className="text-lg text-green-900 dark:text-white font-[PoppinsBold]">
                    Mes Favoris
                </Text>
            </View>

            {favoriteBooks.length > 0 ? (
                <FlatList
                    data={favoriteBooks}
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
                    <Text className="text-gray-600 dark:text-gray-300 font-[Poppins] text-center">
                        Vous n'avez pas encore de favoris.
                    </Text>
                </View>
            )}

            <TouchableOpacity onPress={onClose} className="bg-green-900 p-4 m-4 rounded-xl">
                <Text className="font-[Poppins] text-white text-center font-bold">Fermer</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FavoritesBooksModal;
// components/BookItem.jsx
import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// @ts-ignore
const BookItem = ({ book, loading, isFavorite, onPress, onToggleFavorite }) => {
    return (
        <Pressable
            key={book.id}
            onPress={onPress}
            className="mb-4 bg-white dark:bg-lime-900 rounded-xl shadow-amber-50 active:opacity-90"
        >
            <View className="p-4 flex-row justify-between items-center">
                <View className="flex-row gap-4 items-center flex-1">
                    <Feather name="file-text" size={24} color="#b7d5ac" />
                    <View className="flex-1">
                        <Text allowFontScaling={false} className="font-[Poppins] text-green-800 dark:text-white">
                            {book.title}
                        </Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#388E3C" />
                ) : (
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                        className="items-end"
                    >
                        <View className={`items-center justify-center p-2 rounded-full ${isFavorite ? 'bg-green-50' : ''}`}>
                            <Ionicons
                                name={isFavorite ? "star" : "star-outline"}
                                size={20}
                                color={isFavorite ? "#0a5c0a" : "#b7d5ac"}
                            />
                        </View>
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
};

export default BookItem;
// components/CategoryList.jsx
import React from 'react';
import { FlatList, Pressable, View, Text } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// @ts-ignore
const CategoryList = ({ categories, onCategoryPress }) => {
    // @ts-ignore
    const renderCategoryItem = ({ item: category }) => (
        <Pressable
            key={category}
            onPress={() => onCategoryPress(category)}
            className="mb-4 bg-white dark:bg-lime-900 rounded-xl shadow-amber-50 active:opacity-90"
        >
            <View className="p-4 flex-row justify-between items-center">
                <View className="flex-row gap-4 items-center flex-1">
                    <Feather name="folder" size={24} color="#b7d5ac" />
                    <View className="flex-1">
                        <Text allowFontScaling={false} className="font-[Poppins] text-green-800 dark:text-white">
                            {category}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Ionicons name="enter" size={18} color="#b7d5ac" />
                </View>
            </View>
        </Pressable>
    );

    return (
        <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, marginTop: 8 }}
            indicatorStyle="white"
        />
    );
};

export default CategoryList;
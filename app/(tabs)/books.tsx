import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import { Feather } from '@expo/vector-icons';

export default function BooksScreen() {

  const [searchQuery, setSearchQuery] = useState('');
  const [pdfList, setPdfList] = useState([
    { id: '1', title: 'Ashmawy', category: 'Fiqh', thumbnail: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Risaala', category: 'Fiqh', thumbnail: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Khilass dhahab', category: 'Fiqh', thumbnail: 'https://via.placeholder.com/150' },
    { id: '4', title: "Ta'lim", category: 'Nahwu', thumbnail: 'https://via.placeholder.com/150' },
    { id: '5', title: 'Adjrumiya', category: 'Nahwu', thumbnail: 'https://via.placeholder.com/150' },
  ]);

  const filteredPdfList = pdfList.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // @ts-ignore
  const renderPdfItem = ({ item }) => (
    <TouchableOpacity
      className="w-[48%] bg-green-50 rounded-lg shadow-md mb-4 overflow-hidden"
      onPress={() => {/* Ouvrir le PDF */ }}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-32 bg-gray-300"
        resizeMode="cover"
      />
      {/* <View className="">
        <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
        <Text className="text-amber-800 font-bold text-sm">
          {item.category}
        </Text>
      </View> */}
      <View className="p-3">
        <Text className="text-sm font-bold text-green-800" numberOfLines={1}>{item.title}</Text>
        <Text className="text-xs text-amber-700 font-semibold">{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* En-tête */}
      <View className="bg-white p-6 shadow-md">
        {/* Barre de recherche */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-2">
          <Feather name="search" size={20} color="#FF6F00" />
          <TextInput
            className="flex-1 ml-2 text-gray-900"
            placeholder="Rechercher un PDF..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Liste des PDFs */}
      <FlatList
        data={filteredPdfList}
        renderItem={renderPdfItem}
        keyExtractor={item => item.id}
        numColumns={2} // Vue en grille
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

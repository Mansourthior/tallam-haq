import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Image, Pressable, ImageBackground, useColorScheme } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BooksScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfList, setPdfList] = useState([
    { id: '1', title: 'Al akhdari', category: 'Fiqh', link: 'https://drive.google.com/file/d/1Sd-aHXaF7asNtgN9ysOX75Cq3wtmaBPJ/view?usp=sharing' },
    { id: '2', title: 'Ashmawy', category: 'Fiqh', link: 'https://drive.google.com/file/d/1fp_0rIVchGmK73QY6jo2t9oJktfKdH_e/view?usp=sharing' },
    { id: '3', title: 'Risaala', category: 'Fiqh', link: 'https://drive.google.com/file/d/1INVZFoKZC84vhTImTlzCnwlMtle-aN1q/view?usp=sharing' },
    { id: '4', title: 'Khilass dhahab', category: 'Khassida', link: 'https://drive.google.com/file/d/1g71W8FPsJ5vb17YpdJ-VIFSnCMoWTZCG/view?usp=sharing' },
    { id: '6', title: 'Adjrumiya', category: 'Nahwu', link: 'https://drive.google.com/file/d/1a5fAozWlaft-VM-jJfi-rZQ_-OOGyTTv/view?usp=sharing' },
    { id: '7', title: 'Le nectar cacheté', category: 'Histoire', link: 'https://drive.google.com/file/d/1w816X85g2aSK85stjt2tuIBT36gg5Zm0/view?usp=sharing' },
    { id: '8', title: "Les maladies de l'âme et leurs remèdes", category: 'Soufisme', link: 'https://drive.google.com/file/d/1fT8uU-i_uBvPPWbOSQNX5AoI7cppS8f6/view?usp=sharing' },
    { id: '9', title: "Cheikh Seydi El Hadj Malick", category: 'Khassida', link: 'https://drive.google.com/file/d/10T3xVoAOoM_cHU0boMa-sS2seB4v59c9/view?usp=sharing' },
    { id: '10', title: "Bourde", category: 'Khassida', link: 'https://drive.google.com/file/d/14lTD07cJ4p9s96tp1XqIv6S_SUk9-tqK/view?usp=sharing' },
  ]);

  const filteredPdfList = pdfList.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // @ts-ignore
  const renderPdfItem = ({ item }) => (
    <Pressable
      key={item.id}
      // @ts-ignore
      onPress={() => navigation.navigate('pdf/[route]', { route: item.link.replace("/view", "/preview") })}
      className="mb-4 bg-green-700 dark:bg-lime-900 rounded-xl shadow-amber-50 active:opacity-90"
    >
      <View className="p-4 flex-row justify-between items-center">
        <View className="flex-row gap-4 items-center flex-1">

          <Feather name="file-text" size={24} color="#fff" />

          <View className="flex-1">
            <Text allowFontScaling={false} className="text-lg font-[Poppins] text-white">
              {item.title}
            </Text>
          </View>
        </View>

        <View className="items-end bg-green-100 px-2 py-1 rounded-full">
          <Text allowFontScaling={false} className="text-xs text-green-900 font-[Poppins] font-semibold">
            {item.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <ImageBackground source={colorScheme === 'dark' ? require('../../assets/images/bg-dark.jpg') : require('../../assets/images/bg.jpg')} resizeMode="cover" style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}>
        {/* En-tête */}
        <View className="p-4">
          {/* Barre de recherche */}
          <View className="flex-row items-center bg-white  rounded-full px-4 py-2">
            <Feather name="search" size={20} color="#000" />
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
          contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
}
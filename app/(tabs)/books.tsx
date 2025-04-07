import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable, ImageBackground, useColorScheme, ActivityIndicator, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import booksJson from '../../assets/books.json';

export default function BooksScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const bgDark = require('../../assets/images/bg-dark.jpeg');
  const bgLight = require('../../assets/images/bg-white.jpg');

  // @ts-ignore
  const downloadFile = async (pdfUrl, fileName, id) => {
    try {
      setLoading(id);
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Vérifie si le fichier est déjà téléchargé
      const fileExists = await RNFS.exists(path);
      if (fileExists) {
        setLoading(null);
        return path;
      }

      // Téléchargement depuis Google Drive
      const downloadResult = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: path,
        progress: (res) => {
          console.log(`Téléchargement : ${(res.bytesWritten / res.contentLength * 100).toFixed(2)}%`);
        }
      }).promise;

      setLoading(null);
      return downloadResult.statusCode === 200 ? path : null;
    } catch (error) {
      console.error('Erreur de téléchargement', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Téléchargement échoué',
        text2: 'Vérifiez votre connexion et réessayez.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 100,
      });
      setLoading(null);
      return null;
    }
  };

  // Grouper les PDFs par catégorie
  const categorizedBooks = booksJson.reduce((acc, book) => {
    const category = book.category || 'Autres'; // Si pas de catégorie, on les met dans "Autres"
    // @ts-ignore
    if (!acc[category]) {
      // @ts-ignore
      acc[category] = [];
    }
    // @ts-ignore
    acc[category].push(book);
    return acc;
  }, {});

  const filteredCategories = Object.keys(categorizedBooks);

  // @ts-ignore
  const filteredPdfList = categorizedBooks[selectedCategory]?.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );



  // @ts-ignore
  const openBook = async (url, fileName, id) => {
    const filePath = await downloadFile(url, fileName.split(' ').join('_') + '.pdf', id);
    if (filePath) {
      // @ts-ignore
      navigation.navigate('pdf/[route]', { route: filePath });
    }
  };

  // @ts-ignore
  const renderCategoryItem = (category) => (
    <Pressable
      key={category}
      onPress={() => {
        setSelectedCategory(category);
        // @ts-ignore
        setModalVisible(true);
        setSearchQuery("");
      }}
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
          <Ionicons
            name={"enter"}
            size={18}
            color={"#388E3C"}
          />
        </View>
      </View>
    </Pressable>
  );

  // @ts-ignore
  const renderPdfItem = ({ item }) => (
    <Pressable
      key={item.id}
      // @ts-ignore
      onPress={() => openBook(item.link, item.title, item.id)}
      className="mb-4 bg-white dark:bg-lime-900 rounded-xl shadow-amber-50 active:opacity-90"
    >
      <View className="p-4 flex-row justify-between items-center">
        <View className="flex-row gap-4 items-center flex-1">

          <Feather name="file-text" size={24} color="#b7d5ac" />

          <View className="flex-1">
            <Text allowFontScaling={false} className="font-[Poppins] text-green-800 dark:text-white">
              {item.title}
            </Text>
          </View>
        </View>

        {loading === item.id ? (
          <ActivityIndicator size="small" color="#388E3C" />
        ) : (
          // <View className="items-end bg-green-100 px-2 py-1 rounded-full">
          // favoris
          // </View>
          <View></View>
        )}
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <ImageBackground source={colorScheme === 'dark' ? bgDark : bgLight} resizeMode="cover" style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}>

        {/* Liste des PDFs */}
        <FlatList
          data={filteredCategories}
          renderItem={({ item }) => renderCategoryItem(item)}
          keyExtractor={item => item}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}
          indicatorStyle={"white"}
        />

        {/* Modale pour afficher les livres d'une catégorie */}
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} // Fermer la modale
          animationType="slide"
        >
          <SafeAreaView className="flex-1 p-4 bg-gray-50 dark:bg-black">
            <View className="items-center justify-center p-4">
              <Text allowFontScaling={false} className="text-lg text-green-900 dark:text-black font-[PoppinsBold]">
                {selectedCategory}
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
              // @ts-ignore
              data={filteredPdfList}
              renderItem={renderPdfItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 16 }}
            />

            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-green-900 p-4 m-4 rounded-xl">
              <Text className="font-[Poppins] text-white text-center font-bold">Fermer</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </ImageBackground>
    </View>
  );
}
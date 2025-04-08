// BookScreen.jsx
import { useEffect, useState } from "react";
import { View, ImageBackground, useColorScheme, Modal, SafeAreaView, Pressable, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import booksJson from '../../assets/books.json';
import { assets } from '../../assets/js/assets';
import { loadFavorites, toggleFavorite } from "@/utils/favorites-books";
import CategoryList from '../../components/CategoryList';
import BookModal from '../../components/BookModal';
import { Ionicons } from "@expo/vector-icons";
import FavoritesBooksModal from "@/components/FavoritesBooksModal";

export default function BooksScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Grouper les PDFs par catégorie
  const categorizedBooks = booksJson.reduce((acc, book) => {
    const category = book.category || 'Autres';
    // @ts-ignore
    if (!acc[category]) {
      // @ts-ignore
      acc[category] = [];
    }
    // @ts-ignore
    acc[category].push(book);
    return acc;
  }, {});

  // Liste plate de tous les livres pour l'utiliser dans la modale des favoris
  const allBooks = Object.values(categorizedBooks).flat();

  const filteredCategories = Object.keys(categorizedBooks);

  // @ts-ignore
  const filteredPdfList = categorizedBooks[selectedCategory]?.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Charger les favoris au démarrage
  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await loadFavorites();
      setFavorites(favs);
    };

    fetchFavorites();
  }, []);

  // Fonction pour ajouter/supprimer des favoris
  // @ts-ignore
  const toggleFav = async (id) => {
    const newFavorites = await toggleFavorite(favorites, id);
    setFavorites(newFavorites);
  };

  // @ts-ignore
  const openBook = async (url, fileName, id) => {
    const filePath = await downloadFile(url, fileName.split(' ').join('_') + '.pdf', id);
    if (filePath) {
      setModalVisible(false);
      // @ts-ignore
      navigation.navigate('pdf/[route]', { route: filePath });
    }
  };

  // @ts-ignore
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    setSearchQuery("");
  };

  const openFavoritesModal = () => {
    setFavoritesModalVisible(true);
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={colorScheme === 'dark' ? assets.bgDark : assets.bgLight}
        resizeMode="cover"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <CategoryList
          categories={filteredCategories}
          onCategoryPress={handleCategoryPress}
        />

        <Pressable
          // @ts-ignore
          onPress={openFavoritesModal}
          className="absolute bottom-6 right-6 bg-green-800 w-14 h-14 rounded-full justify-center items-center shadow-lg"
          style={{
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Ionicons name="bookmark" size={24} color="#b7d5ac" />
        </Pressable>

        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
        >
          <SafeAreaView className="flex-1 p-4 bg-gray-50 dark:bg-black">
            <BookModal
              categoryName={selectedCategory}
              books={filteredPdfList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loading}
              favorites={favorites}
              colorScheme={colorScheme}
              onClose={() => setModalVisible(false)}
              onBookOpen={openBook}
              onToggleFavorite={toggleFav}
            />
          </SafeAreaView>
        </Modal>

        {/* Modale pour les favoris */}
        <Modal
          visible={favoritesModalVisible}
          onRequestClose={() => setFavoritesModalVisible(false)}
          animationType="slide"
        >
          <FavoritesBooksModal
            favorites={favorites}
            books={allBooks}
            loading={loading}
            onClose={() => setFavoritesModalVisible(false)}
            onBookOpen={openBook}
            onToggleFavorite={toggleFav}
          />
        </Modal>
      </ImageBackground>
    </View>
  );
}
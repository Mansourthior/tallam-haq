import { useState } from "react";
import { View, Text, TextInput, FlatList, Image, Pressable, ImageBackground, useColorScheme, ActivityIndicator } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

export default function BooksScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(null);
  const [pdfList, setPdfList] = useState([
    { id: '1', title: 'Al akhdari', category: 'Fiqh', link: 'https://drive.google.com/uc?export=download&id=1Sd-aHXaF7asNtgN9ysOX75Cq3wtmaBPJ' },
    { id: '2', title: 'Ashmawy', category: 'Fiqh', link: 'https://drive.google.com/uc?export=download&id=1fp_0rIVchGmK73QY6jo2t9oJktfKdH_e' },
    { id: '3', title: 'Risaala', category: 'Fiqh', link: 'https://drive.google.com/uc?export=download&id=1INVZFoKZC84vhTImTlzCnwlMtle-aN1q' },
    { id: '4', title: 'Khilass dhahab', category: 'Khassida', link: 'https://drive.google.com/uc?export=download&id=1g71W8FPsJ5vb17YpdJ-VIFSnCMoWTZCG' },
    { id: '6', title: 'Adjrumiya', category: 'Nahwu', link: 'https://drive.google.com/uc?export=download&id=1a5fAozWlaft-VM-jJfi-rZQ_-OOGyTTv' },
    { id: '7', title: 'Le nectar cacheté', category: 'Histoire', link: 'https://drive.google.com/uc?export=download&id=1w816X85g2aSK85stjt2tuIBT36gg5Zm0' },
    { id: '8', title: "Les maladies de l'âme et leurs remèdes", category: 'Soufisme', link: 'https://drive.google.com/uc?export=download&id=1fT8uU-i_uBvPPWbOSQNX5AoI7cppS8f6' },
    { id: '9', title: "Cheikh Seydi El Hadj Malick", category: 'Khassida', link: 'https://drive.google.com/uc?export=download&id=10T3xVoAOoM_cHU0boMa-sS2seB4v59c9' },
    { id: '10', title: "Bourde", category: 'Khassida', link: 'https://drive.google.com/uc?export=download&id=14lTD07cJ4p9s96tp1XqIv6S_SUk9-tqK' },
    { id: '11', title: "Jawaahir Al Maani", category: 'Soufisme', link: 'https://drive.google.com/uc?export=download&id=1-JkBkEk9__GL0vAd6IzDKPb0C406ki2o' },
    { id: '12', title: "40 Hadiths Nawawi", category: 'Hadith', link: 'https://drive.google.com/uc?export=download&id=1GMAWl8mrCUiwlo9ea6M-HjvmjX9fy4rB' },
    { id: '13', title: "Fakihatou Toulab", category: 'Soufisme', link: 'https://drive.google.com/uc?export=download&id=1BJfEyyizHkIf1PRHXkqtUYK2WqKvkgJU' },
    { id: '14', title: "Al hikam", category: 'Soufisme', link: 'https://drive.google.com/uc?export=download&id=1dct0fbsVVTWp_jlX-iViENjo0hwP2dCY' },
  ]);
  const bgDark = require('../../assets/images/bg-dark.jpeg');
  const bgLight = require('../../assets/images/bg-white.jpg');
  const filteredPdfList = pdfList.filter(pdf =>
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

  // @ts-ignore
  const openBook = async (url, fileName, id) => {
    const filePath = await downloadFile(url, fileName.split(' ').join('_') + '.pdf', id);
    if (filePath) {
      // @ts-ignore
      navigation.navigate('pdf/[route]', { route: filePath });
    }
  };

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
          <View className="items-end bg-green-100 px-2 py-1 rounded-full">
            <Text allowFontScaling={false} className="text-xs text-green-900 dark:text-black font-[Poppins]">
              {item.category}
            </Text>
          </View>
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
        {/* En-tête */}
        <View className="p-4 bg-transparent dark:bg-transparent">
          {/* Barre de recherche */}
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

        {/* Liste des PDFs */}
        <FlatList
          data={filteredPdfList}
          renderItem={renderPdfItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}
          indicatorStyle={"white"}
        />
      </ImageBackground>
    </View>
  );
}
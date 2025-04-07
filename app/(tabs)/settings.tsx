import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, useColorScheme, ScrollView, Linking, Modal, ImageBackground, Switch, Animated } from "react-native";
import { useColorScheme as useColorSchemeExpo } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { assets } from '../../assets/js/assets';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const systemColorScheme = useColorScheme();
  const { colorScheme, setColorScheme } = useColorSchemeExpo();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fonction pour basculer entre les thèmes avec indicateur d'activité
  const toggleTheme = () => {
    if (isTransitioning) return; // Éviter les clics multiples pendant la transition

    setIsTransitioning(true);

    // Effectuer le changement de thème après un court délai
    setTimeout(() => {
      const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
      setColorScheme(newTheme);
      AsyncStorage.setItem('userTheme', newTheme);

      // Donner un peu de temps pour que le changement prenne effet visuellement
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 100);
  };

  // Détermine le thème actuel à utiliser (colorScheme de nativewind ou fallback sur le système)
  const currentTheme = colorScheme || systemColorScheme;

  // Dans votre composant
  useEffect(() => {
    // Charger le thème sauvegardé au démarrage
    AsyncStorage.getItem('userTheme').then(savedTheme => {
      if (savedTheme) {
        // @ts-ignore
        setColorScheme(savedTheme);
      }
    });
  }, []);

  // @ts-ignore
  const SettingsItem = ({ icon, title, rightComponent, isFocus = false }) => (
    <View className={
      isFocus ? "flex-row items-center justify-between py-4 px-6 bg-green-900 mb-4 rounded-lg" : "flex-row items-center justify-between py-4 px-6 bg-white mb-4 dark:bg-lime-900 rounded-lg"}>
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          color={isFocus ? '#fff' : '#b7d5ac'}
          size={22}
          className="mr-4"
        />
        <Text allowFontScaling={false} className={isFocus ? "font-[Poppins] text-base text-white" : "font-[Poppins] text-base text-green-800 dark:text-white"}>{title}</Text>
      </View>
      {rightComponent}
    </View>
  )

  return (
    <View className="flex-1">
      <ImageBackground source={colorScheme === 'dark' ? assets.bgDark : assets.bgLight} resizeMode="cover" style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}>
        <ScrollView className="p-4">
          <Pressable onPress={() => Linking.openURL('https://paypal.me/MThior392')}>
            <SettingsItem
              icon="heart"
              title="Faire un don pour l'application"
              rightComponent={null}
              isFocus={true}
            />
          </Pressable>

          <SettingsItem
            icon="contrast"
            title={`Mode ${currentTheme === 'dark' ? 'sombre' : 'clair'}`}
            rightComponent={
              <Switch
                value={currentTheme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#ccc', true: '#4caf50' }}
                thumbColor={currentTheme === 'dark' ? '#fff' : '#4caf50'}
                disabled={isTransitioning}
              />
            }
          />

          <Pressable onPress={() =>
            // @ts-ignore
            navigation.navigate("favoris/[sourate]", { sourate: "all" })}>
            <SettingsItem
              icon="bookmark"
              title="Voir mes versets favoris"
              rightComponent={null}
            />
          </Pressable>

          <Pressable onPress={() => setShowAboutModal(true)}>
            <SettingsItem
              icon="information-circle"
              title="À propos"
              rightComponent={null}
            />
          </Pressable>

          <Modal
            visible={showAboutModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowAboutModal(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white dark:bg-gray-800 m-4 p-6 rounded-2xl w-[90%]">
                {/* En-tête modale */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="font-[Poppins] text-xl font-bold text-gray-800 dark:text-gray-100">
                    À propos
                  </Text>
                </View>

                {/* Contenu de la modale */}
                <Text className="font-[Poppins] text-gray-600 dark:text-gray-300 text-base leading-6">
                  Cette application mobile a été conçue dans le but d’aider et d’accompagner la communauté au quotidien.
                  Elle propose des fonctionnalités essentielles comme l’accès au Coran, une bibliothèque de PDF,
                  ainsi que les horaires de prière. Grâce à une interface simple, intuitive et sans publicités,
                  elle permet à chacun de se reconnecter facilement avec sa foi et d’avoir à portée de main des outils
                  pratiques pour enrichir son savoir et sa spiritualité.
                  {"\n\n"}
                  Développé par et pour les serviteurs d'Allah.
                </Text>

                {/* Bouton de fermeture */}
                <Pressable
                  onPress={() => setShowAboutModal(false)}
                  className="mt-6 bg-emerald-800 py-3 px-6 rounded-lg self-center"
                >
                  <Text className="text-white font-bold">Fermer</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View className="mt-20 px-6">
            <Text allowFontScaling={false} className="font-[Poppins] text-white text-center text-base">
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

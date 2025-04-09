import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  useColorScheme as useRNColorScheme,
  ScrollView,
  Linking,
  Modal,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useColorScheme as useColorSchemeExpo } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { assets } from "../../assets/js/assets";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const systemColorScheme = useRNColorScheme(); // système : 'light' | 'dark'
  const { colorScheme, setColorScheme } = useColorSchemeExpo(); // nativewind : 'light' | 'dark'
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCGUModal, setShowCGUModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("userTheme");
        if (savedTheme) {
          setColorScheme(savedTheme as "light" | "dark");
        } else {
          setColorScheme(systemColorScheme as "light" | "dark");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du thème :", error);
      }
    };

    loadThemePreferences();
  }, []);

  const changeTheme = async (theme: "light" | "dark") => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      await AsyncStorage.setItem("userTheme", theme);
      setColorScheme(theme);
      setShowThemeModal(false);
    } catch (err) {
      console.error("Erreur changement de thème :", err);
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const currentTheme = colorScheme;

  // @ts-ignore
  const SettingsItem = ({ icon, title, rightComponent = null, isFocus = false }) => (
    <View
      className={
        isFocus
          ? "flex-row items-center justify-between py-4 px-6 bg-green-950 mb-4 rounded-lg"
          : "flex-row items-center justify-between py-4 px-6 bg-white mb-4 dark:bg-lime-950 rounded-lg"
      }
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          color={isFocus ? "#fff" : "#b7d5ac"}
          size={22}
          className="mr-4"
        />
        <Text
          allowFontScaling={false}
          className={
            isFocus
              ? "font-[Poppins] text-base text-white"
              : "font-[Poppins] text-base text-green-800 dark:text-white"
          }
        >
          {title}
        </Text>
      </View>
      {rightComponent}
    </View>
  );

  const getThemeModeText = () => {
    return `Mode ${colorScheme === "dark" ? "Sombre" : "Clair"}`;
  };

  // @ts-ignore
  const ThemeOption = ({ title, icon, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 mb-2 rounded-lg ${isSelected ? "bg-green-100 dark:bg-green-900" : ""
        }`}
    >
      <Ionicons
        name={icon}
        size={24}
        color={
          isSelected
            ? currentTheme === "dark"
              ? "#fff"
              : "#0a5c0a"
            : "#888"
        }
        style={{ marginRight: 12 }}
      />
      <Text
        className={`font-[Poppins] text-base ${isSelected
          ? currentTheme === "dark"
            ? "text-white"
            : "text-green-900"
          : "text-gray-600 dark:text-gray-400"
          }`}
      >
        {title}
      </Text>
      {isSelected && (
        <Ionicons
          name="checkmark"
          size={20}
          color={currentTheme === "dark" ? "#fff" : "#0a5c0a"}
          style={{ marginLeft: "auto" }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <ImageBackground
        source={currentTheme === "dark" ? assets.bgDark : assets.bgLight}
        resizeMode="cover"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />
      <ScrollView className="p-4">
        <Pressable onPress={() => Linking.openURL("https://paypal.me/MThior392")}>
          <SettingsItem icon="heart" title="Faire un don pour l'application" isFocus={true} />
        </Pressable>

        <Pressable onPress={() => setShowThemeModal(true)}>
          <SettingsItem
            icon="contrast"
            title={getThemeModeText()}
            // @ts-ignore
            rightComponent={
              <Ionicons
                name="chevron-forward"
                color={currentTheme === "dark" ? "#fff" : "#0a5c0a"}
                size={22}
              />
            }
          />
        </Pressable>

        <Pressable
          onPress={() =>
            // @ts-ignore
            navigation.navigate("favoris/[sourate]", { sourate: "all" })
          }
        >
          <SettingsItem icon="bookmark" title="Voir mes versets favoris" />
        </Pressable>

        <Pressable onPress={() => setShowAboutModal(true)}>
          <SettingsItem icon="information-circle" title="À propos" />
        </Pressable>

        <Pressable onPress={() => setShowCGUModal(true)}>
          <SettingsItem icon="document-text-outline" title="Conditions Générales d'Utilisation" />
        </Pressable>

        {/* Modale Sélection Thème */}
        <Modal
          visible={showThemeModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowThemeModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white dark:bg-black m-4 p-6 rounded-2xl w-[90%]">
              <Text className="font-[PoppinsBold] text-lg text-green-900 dark:text-white mb-4 text-center">
                Choisir un thème
              </Text>

              <ThemeOption
                title="Mode Clair"
                icon="sunny-outline"
                onPress={() => changeTheme("light")}
                isSelected={colorScheme === "light"}
              />
              <ThemeOption
                title="Mode Sombre"
                icon="moon-outline"
                onPress={() => changeTheme("dark")}
                isSelected={colorScheme === "dark"}
              />

              <TouchableOpacity
                onPress={() => setShowThemeModal(false)}
                className="mt-6 bg-green-950 py-3 px-6 rounded-lg self-center"
              >
                <Text className="text-white font-[Poppins]">Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modale À propos */}
        <Modal
          visible={showAboutModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowAboutModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white dark:bg-black m-4 p-6 rounded-2xl w-[90%]">
              <Text className="font-[Poppins] text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                À propos
              </Text>
              <Text className="font-[Poppins] text-gray-600 dark:text-gray-300 text-base leading-6">
                Cette application mobile a été conçue dans le but d’aider et d’accompagner la communauté au quotidien.
                Elle propose des fonctionnalités essentielles comme l’accès au Coran, une bibliothèque de PDF,
                ainsi que les horaires de prière. Grâce à une interface simple, intuitive et sans publicités,
                elle permet à chacun de se reconnecter facilement avec sa foi et d’avoir à portée de main des outils
                pratiques pour enrichir son savoir et sa spiritualité.
                {"\n\n"}
                Développé par et pour les serviteurs d'Allah.
              </Text>
              <Pressable
                onPress={() => setShowAboutModal(false)}
                className="mt-6 bg-green-950 py-3 px-6 rounded-lg self-center"
              >
                <Text className="text-white font-bold">Fermer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* CGU */}
        <Modal
          visible={showCGUModal}
          animationType="slide"
          onRequestClose={() => setShowCGUModal(false)}
        >
          <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="items-center justify-center p-4">
              <Text className="text-lg text-green-900 dark:text-white font-[PoppinsBold]">
                Conditions Générales d'Utilisation
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCGUModal(false)}
              className="bg-emerald-950 p-4 m-4 rounded-xl"
            >
              <Text className="text-white text-center font-bold font-[Poppins]">Fermer</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        <View className="py-10 px-6">
          <Text className="font-[PoppinsBold] text-white text-center text-base">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

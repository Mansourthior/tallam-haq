import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable, useColorScheme, ScrollView, Switch, Linking, Modal, ImageBackground } from "react-native";

export default function SettingsScreen() {

  // @ts-ignore
  const colorScheme = useColorScheme();
  const [showAboutModal, setShowAboutModal] = useState(false);

  // @ts-ignore
  const SettingsItem = ({ icon, title, rightComponent, isFocus = false }) => (
    <View className={
      isFocus ? "flex-row items-center justify-between py-4 px-6 bg-green-900 mb-4 rounded-lg" : "flex-row items-center justify-between py-4 px-6 bg-white mb-4 dark:bg-lime-700 rounded-lg"}>
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
      <ImageBackground source={colorScheme === 'dark' ? require('../../assets/images/bg-dark.jpeg') : require('../../assets/images/bg.jpg')} resizeMode="cover" style={{
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
                  <Text className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    À propos
                  </Text>
                  <Pressable onPress={() => setShowAboutModal(false)}>
                    <Ionicons
                      name="close"
                      size={24}
                      className="text-gray-500 dark:text-gray-300"
                    />
                  </Pressable>
                </View>

                {/* Contenu de la modale */}
                <Text className="text-gray-600 dark:text-gray-300 text-base leading-6">
                  Cette application mobile a été conçue dans le but d’aider et d’accompagner la communauté au quotidien.
                  Elle propose des fonctionnalités essentielles comme l’accès au Coran, une bibliothèque de PDF,
                  ainsi que les horaires de prière. Grâce à une interface simple, intuitive et sans publicités,
                  elle permet à chacun de se reconnecter facilement avec sa foi et d’avoir à portée de main des outils
                  pratiques pour enrichir son savoir et son spiritualité.
                  {"\n\n"}
                  Version: 1.0.0
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
            <Text allowFontScaling={false} className="font-[PoppinsBold] text-white text-center text-base">
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

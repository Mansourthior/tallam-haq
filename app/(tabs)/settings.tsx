import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Pressable } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold mb-6 text-emerald-700 text-center">Paramètres</Text>

      <Pressable
        className="flex-row items-center p-4 mb-8 bg-emerald-50 rounded-xl shadow-sm active:opacity-90"
        onPress={() => console.log("Faire un don")}
      >
        <Ionicons name="heart" size={20} color={'#e2dc11'} className="rounded-full mr-4" />
        <Text className="text-lg text-emerald-800 dark:text-gray-100">Faire un don</Text>
      </Pressable>

      <Pressable
        className="flex-row items-center p-4 mb-8  bg-emerald-50 rounded-xl shadow-sm active:opacity-90"
        onPress={() => console.log("Rate the app")}
      >
        <Ionicons name="star" size={24} color={'#e2dc11'} className="mr-4" />
        <Text className="text-lg text-emerald-800 dark:text-gray-100">Notez l'application</Text>
      </Pressable>

      <Pressable
        className="flex-row items-center p-4 mb-8  bg-emerald-50 rounded-xl shadow-sm active:opacity-90"
        onPress={() => console.log("A propos")}
      >
        <Ionicons name="information" size={24} color={'#e2dc11'} className="mr-4" />
        <Text className="text-lg text-emerald-800 dark:text-gray-100">A propos</Text>
      </Pressable>
    </View>
  );
}

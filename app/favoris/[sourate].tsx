import { FavoriteVerse, getAllFavorites, getAllFavoritesVersets } from "@/utils/favorites";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Verset from "@/components/Verset";

export default function FavoriteScreen() {

    const { sourate } = useLocalSearchParams();
    const [favoris, setFavoris] = useState<FavoriteVerse[]>([]);

    useEffect(() => {
        if (!sourate) return;

        if (sourate === "all") {
            getAllFavoritesVersets().then(results => {
                // @ts-ignore
                setFavoris(results)
            });

        } else {
            getAllFavorites().then(results => {
                // @ts-ignore
                setFavoris(results[sourate]);
            });
        }
    }, [sourate]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
            {/* Liste des versets */}
            {favoris && favoris?.length !== 0 ?
                <FlatList
                    data={favoris}
                    renderItem={({ item, index }) => <Verset sourateId={item.sourate} item={item} index={index} favorite={true} />}
                    keyExtractor={(item, index) => index.toString()}
                    indicatorStyle={"white"}
                /> :
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg font-[Poppins] text-center text-green-900 dark:text-white">
                        La liste de favoris est vide
                    </Text>
                </View>
            }
        </SafeAreaView>
    );
}
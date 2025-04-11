import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

// @ts-ignore
export default function Prayers({ locationIsActived, error, nextPrayer, timeLeft, date, prayers }) {

    const getPrayerIcon = (name: string) => {
        switch (name) {
            case "Fajr":
                return "moon-outline";
            case "Dhuhr":
                return "sunny-outline";
            case "Asr":
                return "time-outline";
            case "Maghrib":
                return "partly-sunny-sharp";
            case "Isha":
                return "moon";
            default:
                return "time-outline";
        }
    };


    return (
        <View className="bg-white dark:bg-transparent rounded-3xl p-6 w-11/12 mx-auto mt-4">
            {/* TODO: gérer erreur connectivité */}
            <View className="mb-4 flex flex-row justify-between">
                {!locationIsActived || error ? <View></View> :
                    <View>
                        <Text allowFontScaling={false} className="font-[Poppins] text-lime-950 dark:text-gray-300 text-lg font-bold">{nextPrayer || 'Chargement...'}</Text>
                        {timeLeft == "00:00:00" ?
                            <Animatable.Text animation="pulse"
                                iterationCount="infinite" className="text-lime-700 font-[Poppins] text-sm mt-2">C'est l'heure de la prière ...</Animatable.Text>
                            : <Text allowFontScaling={false} className="font-[Poppins] text-lime-700 text-sm">{timeLeft ? `Dans ${timeLeft}` : 'Chargement...'}</Text>}
                    </View>}
                <View>
                    <Text allowFontScaling={false} className="font-[Poppins] pt-1 text-lime-950 dark:text-gray-300 text-2xl font-bold text-right">
                        اَلسَّلَامُ عَلَيْكُمْ
                    </Text>
                    <Text allowFontScaling={false} className="font-[Poppins] text-lime-700 text-sm text-right">
                        {date?.hijri?.day} {date?.hijri?.month?.en} {date?.hijri.year}
                    </Text>
                </View>
            </View>
            {locationIsActived ?
                (error ? <Text className="font-[Poppins] text-lime-950 dark:text-lime-50 text-md text-center">
                    Impossible de récupérer les heures de prières. Vérifiez votre connexion et réessayez en tirant vers le bas
                    pour rafraîchir la page.
                </Text> : <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                    className="flex-row">
                    {prayers?.hours?.map((prayer: any, index: number) => (
                        <View key={index} className="items-center mx-4">
                            <Ionicons
                                name={getPrayerIcon(prayer.name)}
                                size={24}
                                color={prayer.name == nextPrayer ? "#1e4d2b" : "#b7d5ac"}
                                style={{ marginBottom: 4 }}
                            />
                            <Text
                                allowFontScaling={false}
                                className={`font-[Poppins] text-lime-900/25 dark:text-gray-300 ${prayer.name == nextPrayer
                                    ? "font-bold text-xl font-[Poppins] text-lime-950/100"
                                    : ""
                                    }`}
                            >
                                {prayer.name}
                            </Text>
                            <Text
                                allowFontScaling={false}
                                className={`text-lime-700 dark:text-gray-300 text-sm mt-1 font-[Poppins] ${prayer.name == nextPrayer ? "font-bold" : ""
                                    }`}
                            >
                                {prayer.time ?? '...'}
                            </Text>
                        </View>
                    ))}
                </ScrollView>) :
                <Text className="text-lime-950 dark:text-lime-50 text-md text-center font-[Poppins]">
                    Veuillez activer la localisation dans les paramètres pour visualiser les heures de prière.
                </Text>
            }
        </View>
    );
}
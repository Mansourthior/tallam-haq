import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrayers, fetchHijriDate } from "@/redux/actions";
import dayjs from "dayjs";
import { getToday, getTomorrow } from "../../utils/date-utils";
import { openLink } from '../../utils/link-utils';
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";
import hadithsJson from '../../assets/hadiths.json';
import { schedulePrayerNotifications } from '../../utils/notifications';

export default function HomeScreen() {

  const dispatch = useDispatch();
  // @ts-ignore
  const fetchedPrayers = useSelector((state) => state.prayers.prayers);
  // @ts-ignore
  const fetchedPrayersCle = useSelector((state) => state.prayers.cle);
  // @ts-ignore
  const loading = useSelector((state) => state.prayers.loading);
  // @ts-ignore
  const error = useSelector((state) => state.prayers.error);
  // @ts-ignore
  const date = useSelector((state) => state.date.date);
  // @ts-ignore
  const [nextPrayer, setNextPrayer] = useState(null);
  // @ts-ignore
  const [prayers, setPrayers] = useState(null);
  const [location, setLocation] = useState(null);
  const [nextPrayerTime, setNextPrayerTime] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [hadith, setHadith] = useState<{ arabic: string; french: string; } | null>(null);

  if (loading) {
    // TODO : faire un view pour le loading
  }

  if (error) {
    // TODO : faire un view pour le error
  }

  // call google

  // 1. Gestion de la localisation
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission de localisation refusée");
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      // @ts-ignore
      setLocation(position);
      return position;
    } catch (err) {
      // @ts-ignore
      setError(err.message);
      return null;
    }
  };

  // 2. Chargement initial des données
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Charger la date Hijri en parallèle avec la localisation
        // @ts-ignore
        dispatch(fetchHijriDate(getToday()));

        const position = await getLocation();
        if (!position) return;

        const { longitude, latitude } = position.coords;
        // @ts-ignore
        dispatch(fetchPrayers(getToday(), longitude, latitude));
      } catch (err) {
        // @ts-ignore
        setError(err.message);
      }
    };

    initializeData();
  }, []); // Ne dépend plus de dispatch

  // 3. Mise à jour des prières quand fetchedPrayers change
  useEffect(() => {
    if (!fetchedPrayers) return;

    const formattedPrayers = {
      today: fetchedPrayersCle,
      hours: [
        { name: "Fajr", time: fetchedPrayers.Fajr },
        { name: "Dhuhr", time: fetchedPrayers.Dhuhr },
        { name: "Asr", time: fetchedPrayers.Asr },
        { name: "Maghrib", time: fetchedPrayers.Maghrib },
        { name: "Isha", time: fetchedPrayers.Isha },
      ],
    };
    // @ts-ignore
    setPrayers(formattedPrayers);
    schedulePrayerNotifications(formattedPrayers.hours);
    updateNextPrayer(formattedPrayers);
  }, [fetchedPrayers]);

  // 4. Fonction pour mettre à jour la prochaine prière
  // @ts-ignore
  const updateNextPrayer = (currentPrayers) => {
    const now = dayjs();
    let prayerFound = false;

    if (!currentPrayers?.hours) return;

    for (const prayer of currentPrayers.hours) {
      if (!prayer?.time) continue;

      const [hours, minutes] = prayer.time.split(":").map(Number);
      const targetTime = dayjs().hour(hours).minute(minutes).second(0);
      const diff = targetTime.diff(now, "second");

      if (diff > 0) {
        setNextPrayer(prayer.name);
        setNextPrayerTime(prayer.time);
        prayerFound = true;
        break;
      }
    }

    // @ts-ignore
    if (!prayerFound && location?.coords) {
      // Charger les prières du lendemain
      // @ts-ignore
      const { longitude, latitude } = location.coords;
      if (fetchedPrayersCle != getToday()) {
        const formattedPrayers = {
          today: fetchedPrayersCle,
          hours: [
            { name: "Fajr", time: fetchedPrayers.Fajr },
            { name: "Dhuhr", time: fetchedPrayers.Dhuhr },
            { name: "Asr", time: fetchedPrayers.Asr },
            { name: "Maghrib", time: fetchedPrayers.Maghrib },
            { name: "Isha", time: fetchedPrayers.Isha },
          ],
        };
        // @ts-ignore
        setPrayers(formattedPrayers);
        schedulePrayerNotifications(formattedPrayers.hours);
        // @ts-ignore
        setNextPrayer("Fajr");
        setNextPrayerTime(fetchedPrayers.Fajr);
      } else {
        // @ts-ignore
        dispatch(fetchPrayers(getTomorrow(), longitude, latitude));
      }
    }
  };

  // 5. Mettre à jour la prochaine prière toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (prayers) {
        updateNextPrayer(prayers);
      }
      // @ts-ignore
      dispatch(fetchHijriDate(getToday()));
    }, 60000); // Toutes les 1 minutes

    return () => clearInterval(interval);
  }, [prayers, location]);


  // 6. Mettre à jour le temps restant pour la prochaine prière toutes les secondes
  // TODO : refresh hijri date à 23h 59m 59s
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();

      if (nextPrayerTime !== "" && nextPrayer != null) {
        const [hours, minutes] = nextPrayerTime.split(":").map(Number); // prochaine heure prière
        let targetTime = dayjs().hour(hours).minute(minutes).second(0);;
        let diff = 0;
        if (nextPrayer == 'Fajr' && hours < now.get('hour')) {
          targetTime = targetTime.add(1, 'day');
        }

        diff = targetTime.diff(now, "second");

        if (diff <= 0) {
          setTimeLeft("00:00:00");
        } else {
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;

          setTimeLeft(
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          );
        }
      }
    }, 1000); // Toutes les secondes

    return () => clearInterval(interval);
  }, [nextPrayerTime, nextPrayer]);

  // 1 hadith chaque 1 heure
  useEffect(() => {
    getHadith();
    const interval = setInterval(() => {
      getHadith();
    }, 3600000 * 24);
    return () => clearInterval(interval);
  }, [hadith]);

  const getHadith = () => {
    const random = Math.floor(Math.random() * 10);
    setHadith(hadithsJson[random]);
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="flex-col"
      >
        <View className="bg-rose-50 rounded-3xl shadow-lg p-6 w-11/12 mx-auto mt-4">
          <View className="mb-4 flex flex-row justify-between">
            <View>
              <Text className="text-amber-950 font-bold">{nextPrayer || 'Chargement...'}</Text>
              {timeLeft == "00:00:00" ?
                <Animatable.Text animation="pulse"
                  iterationCount="infinite" className="text-amber-700 text-sm mt-2">C'est l'heure de la prière ...</Animatable.Text>
                : <Text className="text-amber-700 text-sm">{timeLeft ? `Dans ${timeLeft}` : 'Chargement...'}</Text>}
            </View>
            <View>
              <Text className="text-amber-950 text-3xl font-bold font-sans text-right">
                اَلسَّلَامُ عَلَيْكُمْ
              </Text>
              <Text className="text-amber-700 text-sm text-right">
                {date?.hijri?.day} {date?.hijri?.month?.en} {date?.hijri.year}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="flex-row">
            {prayers?.hours?.map((prayer: any, index: number) => (
              <View key={index} className="items-center mx-3">
                <Text
                  className={`text-amber-900/25 ${prayer.name == nextPrayer
                    ? "font-bold text-xl text-yellow-950/100"
                    : ""
                    }`}
                >
                  {prayer.name}
                </Text>
                <Text
                  className={`text-amber-700 text-sm mt-1 ${prayer.name == nextPrayer ? "font-bold" : ""
                    }`}
                >
                  {prayer.time}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="bg-amber-500 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
          <View>
            <Text className="text-amber-800 text-lg font-bold mb-4">
              Hadith
            </Text>
            <Text className="font-sans text-2xl text-right text-amber-700">
              {hadith?.arabic}
            </Text>
            <Text className="text-base mt-2 text-amber-950">
              {hadith?.french}
            </Text>
          </View>
        </View>
        <View className="bg-amber-700 rounded-3xl mx-auto p-6 mt-4 shadow-lg w-11/12">
          <View className="mb-4">
            <Text className="text-white text-lg font-bold">
              Nos chaînes Télégram
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="flex-row"
          >
            {[
              {
                name: "Rimah",
                url: "https://t.me/+3Pb8DAVGsyg5YTg0",
              },
              { name: "Waqaf Sunnah", url: "https://t.me/+uWaq1qWnWyAwNWI0" },
              { name: "Târikh Makgni", url: "https://t.me/HISTOIRE_SUNU_MAKGNI" },
              { name: "Wahabisme", url: "https://t.me/siira_wahhabisme" },
            ].map((channel, index) => (
              <Pressable
                key={index}
                onPress={() => openLink(channel.url)}
              >
                <View className="items-center mx-2">
                  <View className="flex flex-row gap-2 bg-amber-100 px-2 py-1 rounded-full">
                    <Feather name="link" size={14} color="#FF6F00" />
                    <Text className="text-amber-800 font-bold text-xs uppercase">
                      {channel.name}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View className="bg-amber-950 rounded-3xl mx-auto p-6 mt-4 mb-4 shadow-lg w-11/12">
          <View className="mb-4">
            <Text className="text-white text-lg font-bold">
              Nos chaînes Youtube
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="flex-row"
          >
            {[
              {
                name: "ATTIDJANIYA TV",
                url: "https://www.youtube.com/@ATTIDJANIYATV",
              },
              {
                name: "Atilmîzou Tilmiz",
                url: "https://www.youtube.com/@Ndaar-Faam",
              },
            ].map((channel, index) => (
              <Pressable
                key={index}
                onPress={() => openLink(channel.url)}
              >
                <View className="items-center mx-2">
                  <View className="flex flex-row gap-2 bg-amber-100 px-2 py-1 rounded-full">
                    <Feather name="link" size={14} color="#FF6F00" />
                    <Text className="text-amber-800 font-semibold text-xs uppercase">
                      {channel.name}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

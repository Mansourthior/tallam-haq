import {
  View,
  ScrollView,
  RefreshControl,
  ImageBackground,
  useColorScheme,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrayers, fetchHijriDate } from "@/redux/actions";
import dayjs from "dayjs";
import { getToday, getTomorrow } from "../../utils/date-utils";
import hadithsJson from '../../assets/hadiths.json';
import { schedulePrayerNotifications } from '../../utils/notifications-prayers';
import { scheduleHadithNotifications } from '../../utils/notifications-hadith';
import Youtube from "@/components/Youtube";
import Telegram from "@/components/Telegram";
import Hadith from "@/components/Hadith";
import Prayers from "@/components/Prayers";

export default function HomeScreen() {

  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
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
  const [locationIsActived, setLocationIsActived] = useState(true);
  const [nextPrayerTime, setNextPrayerTime] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [hadith, setHadith] = useState<{ hadith_text_ar: string; hadith_text: string; grade: string; takhrij: string; } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const bgDark = require('../../assets/images/bg-dark.jpeg');
  const bgLight = require('../../assets/images/bg-white.jpg');

  // refresh page
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // actions à faire lors du refresh
      initializeData();
      //getHadith();
      setUpPrayersAndNotifications();
      setRefreshing(false);
    }, 2000);
  }, []);

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
    initializeData();
  }, []); // Ne dépend plus de dispatch

  const initializeData = async () => {
    try {
      // Charger la date Hijri en parallèle avec la localisation
      // @ts-ignore
      dispatch(fetchHijriDate(getToday()));

      const position = await getLocation();
      if (!position) {
        setLocationIsActived(false);
        return;
      }
      setLocationIsActived(true);

      const { longitude, latitude } = position.coords;
      // @ts-ignore
      dispatch(fetchPrayers(getToday(), longitude, latitude));
    } catch (err) {
      // @ts-ignore
      setError(err.message);
    }
  };

  // 3. Mise à jour des prières quand fetchedPrayers change
  useEffect(() => {
    setUpPrayersAndNotifications();
  }, [fetchedPrayers]);

  const setUpPrayersAndNotifications = () => {
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
    if (formattedPrayers) {
      schedulePrayerNotifications(formattedPrayers.hours);
    }
    updateNextPrayer(formattedPrayers);
  }

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
      if (hadith) {
        scheduleHadithNotifications(hadith);
      }
    }, 3600000 * 24);
    return () => clearInterval(interval);
  }, []);

  const getHadith = () => {
    const random = Math.floor(Math.random() * 2196);
    // @ts-ignore
    setHadith(hadithsJson[random]);
  }

  return (
    <View className="flex-1">
      <ImageBackground source={colorScheme === 'dark' ? bgDark : bgLight} resizeMode="cover">
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="flex-col"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Prayers locationIsActived={locationIsActived} error={error} nextPrayer={nextPrayer} timeLeft={timeLeft} date={date} prayers={prayers} />
          <Hadith hadith={hadith} />
          <Telegram />
          <Youtube />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

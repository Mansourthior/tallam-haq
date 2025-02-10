import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrayers, fetchNextPrayer, fetchHijriDate } from "@/redux/actions";
import dayjs from "dayjs";
import { getToday, getTomorrow } from "../../utils/date-utils";
import { openLink } from '../../utils/link-utils';

export default function HomeScreen() {
  const dispatch = useDispatch();
  // @ts-ignore
  const prayers = useSelector((state) => state.prayers.prayers);
  // @ts-ignore
  const loading = useSelector((state) => state.prayers.loading);
  // @ts-ignore
  const error = useSelector((state) => state.prayers.error);
  // @ts-ignore
  const nextPrayer = useSelector((state) => state.nextPrayer.nextPrayer);
  // @ts-ignore
  const time = useSelector((state) => state.nextPrayer.time);
  // @ts-ignore
  const date = useSelector((state) => state.date.date);

  const [location, setLocation] = useState(null);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // todo : revoir méthode heures prières - 1 appel par jour pour get tous les prayers après isha avec un boolean pour dire que l'appel a déjà été fait
    const interval = setInterval(() => {
      const now = dayjs();
      const [hours, minutes] = time.split(":").map(Number); // prochaine heure prière
      let targetTime;
      let diff = 0;
      if (nextPrayer == 'Fajr') {
        if (hours < now.get('hour')) {
          getPrayers(getTomorrow());
          targetTime = dayjs().add(1, 'day').hour(hours).minute(minutes).second(0);
        } else {
          targetTime = dayjs().hour(hours).minute(minutes).second(0);
        }
        diff = targetTime.diff(now, "second");
      } else {
        targetTime = dayjs().hour(hours).minute(minutes).second(0);
        diff = targetTime.diff(now, "second");
        getDate();
      }

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        getNextPrayer();
      } else {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    getLocation();
  }, [dispatch]);

  useEffect(() => {
    getDate();
  }, [dispatch]);

  useEffect(() => {
    if (location) {
      getPrayers(getToday());
      getNextPrayer();
    }
  }, [dispatch, location]);

  const getPrayers = (date: string) => {
    dispatch(
      // @ts-ignore
      fetchPrayers(date, location.coords.longitude, location.coords.latitude)
    );
  }

  const getNextPrayer = () => {
    dispatch( // @ts-ignore
      fetchNextPrayer(getToday(), location.coords.longitude, location.coords.latitude)
    );
  }

  const getDate = () => {
    dispatch(// @ts-ignore
      fetchHijriDate(getToday())
    );
  }

  if (loading) {
    // TODO : faire un view pour le loading
  }

  if (error) {
    // TODO : faire un view pour le error
  }

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      // Using expo-location instead of Geolocation
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      // @ts-ignore
      setLocation(position);
    } catch (err) {
      console.error("Error getting location:", err);
    }
  };

  return (
    // TODO : horaires prières (stocker chaque semaine pour mode hors ligne) et hadith du jour
    // TODO : className
    <View className="flex-1 bg-white">
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
              <Text className="text-amber-700 text-sm">{timeLeft ? `Dans ${timeLeft}` : 'Chargement...'}</Text>
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
            className="flex-row"
          >
            {[
              { name: "Fajr", time: prayers.Fajr || '--:--', icon: 'sunrise' },
              { name: "Dhuhr", time: prayers.Dhuhr || '--:--', icon: 'sun' },
              { name: "Asr", time: prayers.Asr || '--:--', icon: 'sun' },
              { name: "Maghrib", time: prayers.Maghrib || '--:--', icon: 'sunset' },
              { name: "Isha", time: prayers.Isha || '--:--', icon: 'moon' },
            ].map((prayer, index) => (
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
              Hadith du jour
            </Text>
            <Text className="font-sans text-2xl text-right text-amber-700">
              عن عبدالله بن عمر رضي الله عنهما قال النبي صلي الله عليه و سلم :
              بني الإسلام على خمس شهادة أن لا إله إلا الله وأن محمدا رسول الله،
              وإقام الصلاة، وإيتاء الزكاة، والحج، وصوم رمضان (رواه البخاري في
              صحيحه رقم ٨)
            </Text>
            <Text className="text-base mt-2 text-amber-950">
              D'après 'Abdallah Ibn 'Omar (qu'Allah les agrée lui et son père),
              le Prophète (ﷺ) a dit: « L'Islam est bâtie sur cinq choses:
              l'attestation qu'il n'y a pas d'autre divinité qui mérite d'être
              adorée si ce n'est Allah et que Muhammad est le Messager d'Allah
              (*), l'accomplissement de la prière, le fait de s'acquitter de la
              zakat, le hajj et le fait de jeûner le Ramadan ».
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
                  <View className="w-16 h-16 rounded-full bg-white mb-2"></View>
                  <View className="bg-amber-100 px-2 py-1 rounded-full">
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
                  <View className="w-16 h-16 rounded-full bg-white mb-2"></View>
                  <View className="bg-amber-100 px-2 py-1 rounded-full">
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

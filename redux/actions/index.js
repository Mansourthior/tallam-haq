import axios from "axios";
import {
  FETCH_SOURATES_REQUEST,
  FETCH_SOURATES_SUCCESS,
  FETCH_SOURATES_FAILURE,
  FETCH_VERSES_REQUEST,
  FETCH_VERSES_SUCCESS,
  FETCH_VERSES_FAILURE,
  FETCH_PRAYERS_FAILURE,
  FETCH_PRAYERS_REQUEST,
  FETCH_PRAYERS_SUCCESS,
  FETCH_DATE_FAILURE,
  FETCH_DATE_REQUEST,
  FETCH_DATE_SUCCESS,
} from "./types";
import souratesJson from '../../assets/sourates.json';
import ayasJson from '../../assets/quran.json';
import traductionsJson from '../../assets/traductions.json';
import phonetiqueJson from '../../assets/phonetique.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = "https://api.alquran.cloud/v1";
const API_PRAYERS_URL = "https://api.aladhan.com/v1";

export const fetchSourates = () => async (dispatch) => {
  dispatch({ type: FETCH_SOURATES_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/surah`);
    dispatch({ type: FETCH_SOURATES_SUCCESS, payload: response.data.data });
  } catch (error) {
    console.error("Error fetching sourates ...", error);
    try {
      dispatch({
        type: FETCH_SOURATES_SUCCESS,
        payload: souratesJson,
      });
    } catch (fallbackError) {
      console.error(
        "Error fetching sourates from fallback json ... ",
        fallbackError
      );
      dispatch({ type: FETCH_SOURATES_FAILURE, error });
    }
  }
};

export const fetchVerses = (sourateNumber) => async (dispatch) => {
  dispatch({ type: FETCH_VERSES_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/surah/${sourateNumber}`);
    let ayahs = handleTraductions(response.data.data.ayahs, sourateNumber);
    ayahs = handlePhonetique(response.data.data.ayahs, sourateNumber);
    dispatch({ type: FETCH_VERSES_SUCCESS, payload: ayahs, name: response.data.data.name });
  } catch (error) {
    try {
      let ayahs = handleTraductions(ayasJson[sourateNumber - 1]?.ayahs, sourateNumber);
      ayahs = handlePhonetique(response.data.data.ayahs, sourateNumber);
      if (ayahs) {
        dispatch({ type: FETCH_VERSES_SUCCESS, payload: ayahs });
      } else {
        console.error("No matching surah found in fallback data");
      }
    } catch (fallbackError) {
      console.error(
        "Error fetching ayahs from fallback json ... ",
        fallbackError
      );
      dispatch({ type: FETCH_VERSES_FAILURE, error: fallbackError.message });
    }
    console.error("Error fetching ayahs from api ...", error);
  }
};

export const fetchHijriDate = (date) => async(dispatch) => {
  dispatch({ type: FETCH_DATE_REQUEST });
  try {
    const response = await axios.get(
      `${API_PRAYERS_URL}/gToH/${date}`
    );
    dispatch({
      type: FETCH_DATE_SUCCESS,
      payload: response.data?.data
    });
  } catch (error) {
    console.error("Error fetching date from api ...", error);
    dispatch({ type: FETCH_DATE_FAILURE, error: error.data });
  }
}

const handleTraductions = (ayahs, sourate) => {
  const traductions = traductionsJson[sourate];
  ayahs.map(aya => {
    const traduction = traductions.find(t => t.aya == aya.numberInSurah);
    aya.fr = traduction?.fr;
  })
  return ayahs;
}

const handlePhonetique = (ayahs, sourate) => {
  const phonetique = phonetiqueJson[sourate];
  ayahs.map(aya => {
    const p = phonetique.find(t => t.id == aya.numberInSurah);
    aya.transliteration = p?.transliteration;
  })
  return ayahs;
}

const fetchPrayerTimesForYear = async (year, longitude, latitude) => {
  try {
    const response = await fetch(`${API_PRAYERS_URL}/calendar/${year}?latitude=${latitude}&longitude=${longitude}`); // Remplace avec ton API
    const results = await response.json();
    await AsyncStorage.setItem("prayerTimes", JSON.stringify(results.data));
    await AsyncStorage.setItem("lastUpdate", new Date().toISOString()); // Stocke la date du dernier rafraîchissement
    return results.data;
  } catch (error) {
    console.error("Erreur de récupération des horaires de prière :", error);
    return null;
  }
};

const shouldRefreshData = async () => {
  const lastUpdate = await AsyncStorage.getItem("lastUpdate");
  
  if (!lastUpdate) return true; // Si aucune mise à jour enregistrée, on récupère les données

  const lastUpdateDate = new Date(lastUpdate);
  const today = new Date();
  const daysSinceLastUpdate = (today - lastUpdateDate) / (1000 * 60 * 60 * 24);

  return daysSinceLastUpdate >= 30; // Rafraîchit tous les 30 jours
}

const loadPrayerTimes = async (year, longitude, latitude) => {
  const needsRefresh = await shouldRefreshData();

  if (needsRefresh) {
    return await fetchPrayerTimesForYear(year, longitude, latitude); // Met à jour si nécessaire
  }

  const cachedData = await AsyncStorage.getItem("prayerTimes");
  return cachedData ? JSON.parse(cachedData) : await fetchPrayerTimesForYear();
};


export const fetchPrayers = (date, longitude, latitude) => async (dispatch) => {
  dispatch({ type: FETCH_PRAYERS_REQUEST });
  try {
    const year = date.split('-')[2];
    // Charge les données stockées localement (si elles existent)
    const allTimes = await loadPrayerTimes(year, longitude, latitude); // Assure-toi que cette fonction charge toutes les données de l'année.
    if (!allTimes) {
      dispatch({ type: FETCH_PRAYERS_FAILURE, error: "Erreur récupération heures prières ..." }); // Si aucune donnée n'est disponible
      return;
    }

    // Chercher dans toutes les clés de mois (par exemple "1", "2", etc.)
    let prayerDay = null;
    for (const monthKey in allTimes) {
      const monthData = allTimes[monthKey];  // Data pour chaque mois (1, 2, 3, ...)

      prayerDay = monthData.find(item => item.date.gregorian.date === date);
      if (prayerDay) break;  // Si trouvé, sortir de la boucle
    }

    if (prayerDay) {
      const cleanedTimings = {};
      Object.entries(prayerDay.timings).forEach(([key, value]) => {
        cleanedTimings[key] = value.replace(" (CEST)", "");
      });
      dispatch({
        type: FETCH_PRAYERS_SUCCESS,
        payload: cleanedTimings,
        cle: prayerDay.date.gregorian.date,
      });
    } else {
      dispatch({ type: FETCH_PRAYERS_FAILURE, error: "Erreur récupération heures prières ..." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des horaires de prière pour le jour", error);
    dispatch({ type: FETCH_PRAYERS_FAILURE, error: error });
  }
};

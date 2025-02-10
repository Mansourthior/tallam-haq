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
  FETCH_NEXT_PRAYER_FAILURE,
  FETCH_NEXT_PRAYER_REQUEST,
  FETCH_NEXT_PRAYER_SUCCESS,
  FETCH_DATE_FAILURE,
  FETCH_DATE_REQUEST,
  FETCH_DATE_SUCCESS,
} from "./types";

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
      const fallbackResponse = await axios.get("/sourates.json");
      dispatch({
        type: FETCH_SOURATES_SUCCESS,
        payload: fallbackResponse.data,
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
    
    dispatch({ type: FETCH_VERSES_SUCCESS, payload: response.data.data.ayahs, name: response.data.data.name });
  } catch (error) {
    console.error("Error fetching ayahs from api ...", error);
    try {
      const fallbackResponse = await axios.get("../../data/quran.json");
      const ayahs = fallbackResponse.find(
        (s) => Number(s.number) === sourateNumber
      )?.ayahs;
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

export const fetchPrayers = (date, longitude, latitude) => async (dispatch) => {
  dispatch({ type: FETCH_PRAYERS_REQUEST });
  try {
    const response = await axios.get(
      `${API_PRAYERS_URL}/timings/${date}?latitude=${latitude}&longitude=${longitude}`
    );
    dispatch({
      type: FETCH_PRAYERS_SUCCESS,
      payload: response.data?.data?.timings
    });
  } catch (error) {
    console.error("Error fetching prayers from api ...", error);
    dispatch({ type: FETCH_PRAYERS_FAILURE, error: error.data });
  }
};

export const fetchNextPrayer = (date, longitude, latitude) => async (dispatch) => {
    dispatch({ type: FETCH_NEXT_PRAYER_REQUEST });
    try {
      const response = await axios.get(
        `${API_PRAYERS_URL}/nextPrayer/${date}?latitude=${latitude}&longitude=${longitude}`
      );

      const name = Object.keys(response.data?.data?.timings);
      
      dispatch({
        type: FETCH_NEXT_PRAYER_SUCCESS,
        payload: name,
        time: response.data?.data?.timings[name]
      });
    } catch (error) {
      console.error("Error fetching next prayer from api ...", error);
      dispatch({ type: FETCH_NEXT_PRAYER_FAILURE, error: error.data });
    }
  };

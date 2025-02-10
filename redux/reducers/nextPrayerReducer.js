// src/redux/reducers/nextPrayerReducer.js
import {
  FETCH_NEXT_PRAYER_REQUEST,
  FETCH_NEXT_PRAYER_SUCCESS,
  FETCH_NEXT_PRAYER_FAILURE,
} from "../actions/types";

const initialState = {
  nextPrayer: null,
  time: null,
  loading: false,
  error: null,
};

const nextPrayerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEXT_PRAYER_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_NEXT_PRAYER_SUCCESS:
      return {
        ...state,
        loading: false,
        nextPrayer: action.payload,
        time: action.time,
      };
    case FETCH_NEXT_PRAYER_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default nextPrayerReducer;

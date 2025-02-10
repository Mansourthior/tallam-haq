// src/redux/reducers/prayersReducer.js
import {
  FETCH_PRAYERS_REQUEST,
  FETCH_PRAYERS_SUCCESS,
  FETCH_PRAYERS_FAILURE,
} from "../actions/types";

const initialState = {
  prayers: {},
  loading: false,
  error: null,
};

const prayersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRAYERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PRAYERS_SUCCESS:
      return {
        ...state,
        loading: false,
        prayers: action.payload
      };
    case FETCH_PRAYERS_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default prayersReducer;

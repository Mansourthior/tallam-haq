// src/redux/reducers/dateReducer.js
import {
  FETCH_DATE_REQUEST,
  FETCH_DATE_SUCCESS,
  FETCH_DATE_FAILURE,
} from "../actions/types";

const initialState = {
  date: null,
  loading: false,
  error: null,
};

const dateReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DATE_SUCCESS:
      return {
        ...state,
        loading: false,
        date: action.payload
      };
    case FETCH_DATE_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default dateReducer;

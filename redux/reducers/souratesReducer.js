// src/redux/reducers/souratesReducer.js
import {
  FETCH_SOURATES_REQUEST,
  FETCH_SOURATES_SUCCESS,
  FETCH_SOURATES_FAILURE,
} from '../actions/types';

const initialState = {
  sourates: [],
  loading: false,
  error: null,
};

const souratesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOURATES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SOURATES_SUCCESS:
      return { ...state, loading: false, sourates: action.payload };
    case FETCH_SOURATES_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default souratesReducer;

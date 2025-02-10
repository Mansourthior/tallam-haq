// src/redux/reducers/versesReducer.js
import {
  FETCH_VERSES_REQUEST,
  FETCH_VERSES_SUCCESS,
  FETCH_VERSES_FAILURE,
} from '../actions/types';

const initialState = {
  verses: [],
  name: null,
  loading: false,
  error: null,
};

const versesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VERSES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_VERSES_SUCCESS:
      return { ...state, loading: false, verses: action.payload, name: action.name};
    case FETCH_VERSES_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default versesReducer;

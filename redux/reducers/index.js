import { combineReducers } from 'redux';
import souratesReducer from './souratesReducer';
import versesReducer from './versesReducer';

const rootReducer = combineReducers({
  sourates: souratesReducer,
  verses: versesReducer,
});

export default rootReducer;

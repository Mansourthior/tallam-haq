import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger'
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;

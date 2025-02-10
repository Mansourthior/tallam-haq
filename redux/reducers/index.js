import { combineReducers } from "redux";
import souratesReducer from "./souratesReducer";
import versesReducer from "./versesReducer";
import prayersReducer from "./prayersReducer";
import nextPrayerReducer from "./nextPrayerReducer";
import dateReducer from "./dateReducer";

const rootReducer = combineReducers({
  sourates: souratesReducer,
  verses: versesReducer,
  prayers: prayersReducer,
  nextPrayer: nextPrayerReducer,
  date: dateReducer,
});

export default rootReducer;

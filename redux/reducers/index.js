import { combineReducers } from "redux";
import souratesReducer from "./souratesReducer";
import versesReducer from "./versesReducer";
import prayersReducer from "./prayersReducer";
import dateReducer from "./dateReducer";

const rootReducer = combineReducers({
  sourates: souratesReducer,
  verses: versesReducer,
  prayers: prayersReducer,
  date: dateReducer,
});

export default rootReducer;

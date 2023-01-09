import { combineReducers } from "redux";
import alertReducers from "./alert";
import authReducer from "./auth";

export default combineReducers({
  alertReducers,
  authReducer,
});

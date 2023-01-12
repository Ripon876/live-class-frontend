import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import userReducer from "./userReducer";
import iceConfigReducer from "./iceConfig";

const rootReducer = combineReducers({
	user: userReducer,
	iceConfig: iceConfigReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;

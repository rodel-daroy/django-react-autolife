import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"],
  manualPersist: true
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};

const middleware = [thunk];

let store;
if (process.env.REACT_APP_ENV === "production") {
  store = createStore(
    persistedReducer,
    initialState,
    applyMiddleware(...middleware)
  );
} else {
  store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
}

const persistor = persistStore(store);

export default store;
export { persistor };

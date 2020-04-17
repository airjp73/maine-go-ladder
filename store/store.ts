import { configureStore, combineReducers } from "@reduxjs/toolkit";
import mainPageSlice from "../users/mainPageSlice";

const rootReducer = combineReducers({
  mainPage: mainPageSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

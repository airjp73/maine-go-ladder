import { configureStore, Store, combineReducers } from "@reduxjs/toolkit";
import userSlice from "../users/userSlice";
import loadingSlice from "../loading/loadingSlice";

const rootReducer = combineReducers({
  users: userSlice.reducer,
  loading: loadingSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

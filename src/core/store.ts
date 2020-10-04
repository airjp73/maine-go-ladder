import { configureStore, combineReducers } from "@reduxjs/toolkit";
import mainPageSlice from "../users/mainPageSlice";
import userSlice from "../resources/users/userSlice";
import ladderSlice from "../resources/ladder-history/ladderSlice";
import sessionSlice from "../resources/session/sessionSlice";

const rootReducer = combineReducers({
  mainPage: mainPageSlice.reducer,
  users: userSlice.reducer,
  ladderHistory: ladderSlice.reducer,
  session: sessionSlice.reducer,
});

export const createStore = () =>
  configureStore({
    reducer: rootReducer,
  });

const store = createStore();

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

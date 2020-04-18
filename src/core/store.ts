import { configureStore, combineReducers } from "@reduxjs/toolkit";
import mainPageSlice from "../users/mainPageSlice";
import userSlice from "../resources/users/userSlice";
import gameSlice from "../resources/games/gameSlice";

const rootReducer = combineReducers({
  mainPage: mainPageSlice.reducer,
  users: userSlice.reducer,
  games: gameSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

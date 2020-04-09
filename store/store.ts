import { configureStore, Store, combineReducers } from "@reduxjs/toolkit";
import loadingSlice from "../loading/loadingSlice";
import { Router } from "next/router";
import userSlice from "../users/userSlice";

const rootReducer = combineReducers({
  loading: loadingSlice.reducer,
  users: userSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Any global hooks should go here
Router.events.on("routeChangeStart", () => {
  store.dispatch(loadingSlice.actions.onNavigate());
});

export default store;

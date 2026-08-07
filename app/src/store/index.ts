import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-store";
import snackbarReducer from "./snackbar-store";

export const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackbarReducer,
  },
});

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

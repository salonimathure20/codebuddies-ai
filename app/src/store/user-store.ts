import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./index";
import { DecodedToken } from "../models/decoded-token";

interface UserState {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  profilePicture: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  profilePicture: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<DecodedToken>) => {
      console.log("state");
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

// Selectors
export const selectUser = (state: AppState) => state.user.user;
export const selectIsAuthenticated = (state: AppState) =>
  state.user.isAuthenticated;

// Export reducer
export default userSlice.reducer;

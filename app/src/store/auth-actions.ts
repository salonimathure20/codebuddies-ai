import { createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginAction, logout as logoutAction } from "./user-store";
import { login as loginService } from "../services/user-service";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../models/decoded-token";

// Login Action
export const login = createAsyncThunk(
  "auth/login",
  async (userData: { email: string; password: string }, { dispatch }) => {
    const { token, decoded } = await loginService(userData);

    // Save token in localStorage
    localStorage.setItem("token", token);

    // Dispatch login action
    dispatch(loginAction(decoded));

    return decoded;
  }
);
export const reloadReducer = createAsyncThunk(
  "auth/reload",
  async (_: {}, { dispatch }) => {
    console.log("sasas");
    // Get token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const decoded: DecodedToken = await jwtDecode(token);

    // Dispatch login action
    dispatch(loginAction(decoded));

    return decoded;
  }
);

// Logout Action
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Dispatch logout action
    dispatch(logoutAction());
  }
);

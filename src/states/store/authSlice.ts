// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { email: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ email: string; access: string; refresh: string }>
    ) => {
      state.user = { email: action.payload.email };
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;

      // Only persist non-sensitive user info; tokens live in httpOnly cookies
      localStorage.setItem(
        "user",
        JSON.stringify({ email: action.payload.email })
      );
    },
    loadFromStorage: (state) => {
      const user = localStorage.getItem("user");
      if (user) {
        state.user = JSON.parse(user);
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, loadFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;

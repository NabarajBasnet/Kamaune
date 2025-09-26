import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./slicer";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
  },
});

export default store;

// optional: for typing in TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

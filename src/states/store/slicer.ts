import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarMinimized: false,
};

const MainReduxSlice = createSlice({
  name: "mainReduxSlicer",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarMinimized = !state.sidebarMinimized;
    },
  },
});

export const { toggleSidebar } = MainReduxSlice.actions;

export default MainReduxSlice.reducer;

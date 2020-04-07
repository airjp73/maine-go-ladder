import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  userHasNavigated: boolean;
}

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    userHasNavigated: false,
  } as LoadingState,
  reducers: {
    onNavigate: (state) => {
      state.userHasNavigated = true;
    },
  },
});

export default loadingSlice;

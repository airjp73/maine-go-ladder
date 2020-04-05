import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../users/userSlice";

interface LoadingState {
  initialDataLoaded: boolean;
  userHasNavigated: boolean;
}

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    initialDataLoaded: false,
    userHasNavigated: false,
  } as LoadingState,
  reducers: {
    onNavigate: (state) => {
      state.userHasNavigated = true;
    },
  },
  extraReducers: {
    [fetchUsers.fulfilled.type]: (state) => {
      state.initialDataLoaded = true;
    },
  },
});

export default loadingSlice;

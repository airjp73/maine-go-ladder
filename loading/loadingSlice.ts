import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../users/userSlice";

interface LoadingState {
  initialDataLoaded: boolean;
}

const loadingSlice = createSlice({
  name: "loading",
  initialState: { initialDataLoaded: false } as LoadingState,
  reducers: {},
  extraReducers: {
    [fetchUsers.fulfilled.type]: (state) => {
      state.initialDataLoaded = true;
    },
  },
});

export default loadingSlice;

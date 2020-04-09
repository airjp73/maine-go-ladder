import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../api/User";
import loadingSlice from "../loading/loadingSlice";

interface UserState {
  selectedUser: User | null;
}

const userSlice = createSlice({
  name: "users",
  initialState: { selectedUser: null } as UserState,
  reducers: {
    selectUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
    deselectUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = null;
    },
  },
  extraReducers: {
    [loadingSlice.actions.onNavigate.type]: (state) => {
      state.selectedUser = null;
    },
  },
});

export default userSlice;

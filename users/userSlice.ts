import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { User } from "../apiTypes/User";
import fetch from "isomorphic-fetch";
import { AppState } from "../store/store";

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.ladder_rung - b.ladder_rung,
});

export const userSelectors = userAdapter.getSelectors(
  (state: AppState) => state.users
);

export const fetchUsers = createAsyncThunk<User[]>(
  "users/get-all",
  async () => {
    const response = await fetch("/api/users");
    return response.json();
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      userAdapter.setAll(state, action.payload);
    });
  },
});

export default userSlice;

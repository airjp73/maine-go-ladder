import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { User, NewUser, NewGame } from "../apiTypes/User";
import fetch from "isomorphic-fetch";
import { AppState } from "../store/store";

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => b.ladder_rung - a.ladder_rung,
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

export const postUser = createAsyncThunk<User, NewUser>(
  "users/post",
  async (payload) => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.json();
  }
);

export const postGame = createAsyncThunk<void, NewGame>(
  "users/post",
  async (payload) => {
    await fetch("/api/record-game", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
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

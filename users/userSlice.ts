import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { User } from "../apiTypes/User";

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.ladder_rung - b.ladder_rung,
});

const userSlice = createSlice({
  name: "users",
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: {},
});

export default userSlice;

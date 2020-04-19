import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { User, NewUser } from "./User";
import fetch from "isomorphic-fetch";
import { AppState } from "../../core/store";
import LoadingStates from "../../common/enum/LoadingStates";

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

export const deleteUser = createAsyncThunk<{}, string>(
  "users/delete",
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    return response.json();
  }
);

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => b.ladder_rung - a.ladder_rung,
});

export const userSelectors = userAdapter.getSelectors(
  (state: AppState) => state.users
);

const userSlice = createSlice({
  name: "users",
  initialState: userAdapter.getInitialState({
    loading: LoadingStates.IDLE,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = LoadingStates.LOADING;
    });

    builder.addCase(fetchUsers.rejected, (state) => {
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      userAdapter.setAll(state, action.payload);
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      userAdapter.removeOne(state, action.meta.arg);
    });
  },
});

export default userSlice;

import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { User, NewUser } from "./User";
import { AppState } from "../../core/store";
import LoadingStates from "../../common/enum/LoadingStates";
import performFetch from "../../common/api/performFetch";

export const fetchUsers = createAsyncThunk<User[]>(
  "users/get-all",
  async () => {
    const response = await performFetch("/api/users");
    return response.json();
  }
);

export const postUser = createAsyncThunk<User, NewUser>(
  "users/post",
  async (payload) => {
    const response = await performFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.json();
  }
);

export const deleteUser = createAsyncThunk<Record<string, unknown>, string>(
  "users/delete",
  async (userId) => {
    const response = await performFetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    return response.json();
  }
);

export type NamePatch = { id: string; name: string };
export const renameUser = createAsyncThunk<User, NamePatch>(
  "users/edit",
  async ({ id, name }) => {
    const response = await performFetch(`/api/users/${id}`, {
      body: JSON.stringify({ name }),
      method: "PATCH",
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
    updatedUsers: [] as string[],
  }),
  reducers: {
    userUpdateCommunicated: (state, action: PayloadAction<string>) => {
      state.updatedUsers = state.updatedUsers.filter(
        (userId) => userId === action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      if (state.loading === LoadingStates.IDLE)
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

    builder.addCase(renameUser.fulfilled, (state, action) => {
      userAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    });
  },
});

export default userSlice;

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { User } from "../api/User";
import fetchData from "../api/fetchData";
import gql from "graphql-tag";
import { AppState } from "../store/store";

const fetchQuery = gql`
  query {
    users {
      id
      name
      rating
    }
  }
`;

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  (): Promise<{ users: User[] }> => fetchData(fetchQuery)
);

export const userEntity = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => b.rating - a.rating,
});

export const userSelectors = userEntity.getSelectors(
  (state: AppState) => state.users
);

const userSlice = createSlice({
  initialState: userEntity.getInitialState(),
  name: "users",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) =>
      userEntity.setAll(state, action.payload.users)
    );
  },
});

export default userSlice;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../api/User";
import fetchData from "../api/fetchData";
import gql from "graphql-tag";

const fetchQuery = gql`
  query {
    users {
      id
      name
    }
  }
`;

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  (): Promise<{ users: User[] }> => fetchData(fetchQuery)
);

const userSlice = createSlice({
  initialState: [] as User[],
  name: "users",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action) => action.payload.users
    );
  },
});

export default userSlice;

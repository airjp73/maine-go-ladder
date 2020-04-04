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

interface AddUserResponse {
  insert_users: { returning: User[] };
}
interface AddUserPayload {
  name: string;
  rating: number;
}
export const addUser = createAsyncThunk(
  "users/add",
  async ({ name, rating }: AddUserPayload, thunkApi) => {
    const addQuery = gql`
      mutation AddUser {
        insert_users(objects: { name: "${name}", rating: ${rating} }) {
          returning {
            id
            name
            rating
          }
        }
      }
    `;

    try {
      const data = await fetchData<AddUserResponse>(addQuery);
      return data.insert_users.returning[0];
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
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

    builder.addCase(addUser.fulfilled, (state, action) => {
      userEntity.addOne(state, action.payload);
    });
  },
});

export default userSlice;

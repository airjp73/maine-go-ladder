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
      ladder_rung
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
  ladder_rung: number;
}
export const addUser = createAsyncThunk(
  "users/add",
  async ({ name, ladder_rung }: AddUserPayload, thunkApi) => {
    const addQuery = gql`
      mutation AddUser {
        insert_users(objects: { name: "${name}", ladder_rung: ${ladder_rung.toString()} }) {
          returning {
            id
            name
            ladder_rung
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
  sortComparer: (a, b) => b.ladder_rung - a.ladder_rung,
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

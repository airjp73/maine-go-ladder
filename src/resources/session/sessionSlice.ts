import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import LoadingStates from "../../common/enum/LoadingStates";
import performFetch from "../../common/api/performFetch";
import { Session } from "./session";

export const fetchSession = createAsyncThunk<Session>(
  "session/get",
  async () => {
    const response = await performFetch("/api/session");
    return response.json();
  }
);

export const login = createAsyncThunk<Session, { password: string }>(
  "session/login",
  async (payload) => {
    const response = await performFetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.json();
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    session: null as Session | null,
    loading: LoadingStates.IDLE,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSession.pending, (state) => {
      if (state.loading === LoadingStates.IDLE)
        state.loading = LoadingStates.LOADING;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = LoadingStates.LOADING;
    });

    builder.addCase(fetchSession.rejected, (state) => {
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(login.rejected, (state) => {
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(fetchSession.fulfilled, (state, action) => {
      state.session = action.payload;
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.session = action.payload;
      state.loading = LoadingStates.COMPLETE;
    });
  },
});

export default sessionSlice;

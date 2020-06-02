import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppState } from "../../core/store";
import LoadingStates from "../../common/enum/LoadingStates";
import performFetch from "../../common/api/performFetch";
import { AuditEvent } from "./AuditEvent";
import sortByDate from "../../common/util/sortBydate";

export const fetchAuditEvents = createAsyncThunk<AuditEvent[]>(
  "audit-events/get-all",
  async () => {
    const response = await performFetch("/api/audit-events");
    return response.json();
  }
);

const auditEventAdapter = createEntityAdapter<AuditEvent>({
  selectId: (auditEvent) => auditEvent.id,
  sortComparer: sortByDate("created_at"),
});

export const auditEventSelectors = auditEventAdapter.getSelectors(
  (state: AppState) => state.auditEvents
);

const auditEventSlice = createSlice({
  name: "users",
  initialState: auditEventAdapter.getInitialState({
    loading: LoadingStates.IDLE,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAuditEvents.pending, (state) => {
      if (state.loading === LoadingStates.IDLE)
        state.loading = LoadingStates.LOADING;
    });

    builder.addCase(fetchAuditEvents.rejected, (state) => {
      state.loading = LoadingStates.COMPLETE;
    });

    builder.addCase(fetchAuditEvents.fulfilled, (state, action) => {
      auditEventAdapter.setAll(state, action.payload);
      state.loading = LoadingStates.COMPLETE;
    });
  },
});

export default auditEventSlice;

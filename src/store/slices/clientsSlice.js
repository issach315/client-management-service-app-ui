import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "@/services";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getClients(params);
      return response.data; // Spring Page<T>: { content, totalElements, totalPages, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch clients",
      );
    }
  },
);

export const fetchClientById = createAsyncThunk(
  "clients/fetchClientById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getClientById(id);
      return response.data?.data ?? response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch client",
      );
    }
  },
);

export const addClient = createAsyncThunk(
  "clients/addClient",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createClient(data);
      return response.data?.data ?? response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create client",
      );
    }
  },
);

export const editClient = createAsyncThunk(
  "clients/editClient",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateClient(id, data);
      return response.data?.data ?? response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update client",
      );
    }
  },
);

export const removeClient = createAsyncThunk(
  "clients/removeClient",
  async (id, { rejectWithValue }) => {
    try {
      await deleteClient(id);
      return id; // return id so we can remove from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete client",
      );
    }
  },
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  // List
  clients: [],
  totalElements: 0,
  totalPages: 0,
  listLoading: false,
  listError: null,

  // Single client (detail / edit page)
  selectedClient: null,
  detailLoading: false,
  detailError: null,

  // Mutations
  mutating: false, // true during add / edit / delete
  mutateError: null,
  lastMutateSuccess: null, // "added" | "updated" | "deleted"
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearMutateStatus(state) {
      state.mutating = false;
      state.mutateError = null;
      state.lastMutateSuccess = null;
    },
    clearSelectedClient(state) {
      state.selectedClient = null;
      state.detailError = null;
    },
    clearListError(state) {
      state.listError = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchClients ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchClients.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.listLoading = false;
        // Handle both plain array and Spring Page<T> response shapes
        if (Array.isArray(action.payload)) {
          state.clients = action.payload;
          state.totalElements = action.payload.length;
          state.totalPages = 1;
        } else {
          state.clients = action.payload.content ?? [];
          state.totalElements = action.payload.totalElements ?? 0;
          state.totalPages = action.payload.totalPages ?? 1;
        }
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      });

    // ── fetchClientById ───────────────────────────────────────────────────────
    builder
      .addCase(fetchClientById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedClient = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });

    // ── addClient ─────────────────────────────────────────────────────────────
    builder
      .addCase(addClient.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
        state.lastMutateSuccess = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.mutating = false;
        state.lastMutateSuccess = "added";
        // Optimistically prepend — DataTable will refetch anyway via refreshKey
        if (action.payload?.id) {
          state.clients.unshift(action.payload);
          state.totalElements += 1;
        }
      })
      .addCase(addClient.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError = action.payload;
      });

    // ── editClient ────────────────────────────────────────────────────────────
    builder
      .addCase(editClient.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
        state.lastMutateSuccess = null;
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.mutating = false;
        state.lastMutateSuccess = "updated";
        // Update the record in the list if it's already loaded
        const idx = state.clients.findIndex((c) => c.id === action.payload?.id);
        if (idx !== -1) state.clients[idx] = action.payload;
        // Also update selectedClient if it's the same
        if (state.selectedClient?.id === action.payload?.id) {
          state.selectedClient = action.payload;
        }
      })
      .addCase(editClient.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError = action.payload;
      });

    // ── removeClient ──────────────────────────────────────────────────────────
    builder
      .addCase(removeClient.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
        state.lastMutateSuccess = null;
      })
      .addCase(removeClient.fulfilled, (state, action) => {
        state.mutating = false;
        state.lastMutateSuccess = "deleted";
        state.clients = state.clients.filter((c) => c.id !== action.payload);
        state.totalElements = Math.max(0, state.totalElements - 1);
      })
      .addCase(removeClient.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError = action.payload;
      });
  },
});

export const { clearMutateStatus, clearSelectedClient, clearListError } =
  clientsSlice.actions;

export default clientsSlice.reducer;

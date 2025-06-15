import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { apiGet } from '@/lib/api';

interface PoolState {
  pool: [];
  loading: boolean;
  error: string | null;
}

const initialState: PoolState = {
  pool: [],
  loading: false,
  error: null,
};

// Async thunk to fetch pool data
export const fetchPool = createAsyncThunk<[], void, { rejectValue: string }>(
  'fetchPool',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet<{ pools: [] }>('/pool');
      return response.pools;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pool');
    }
  }
);

const poolSlice = createSlice({
  name: 'pool',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPool.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPool.fulfilled, (state, action: PayloadAction<[]>) => {
        state.loading = false;
        state.pool = action.payload;
      })
      .addCase(fetchPool.rejected, (state, action) => {
        state.loading = false;
        state.pool = [];
        state.error = action.payload || 'Failed to fetch pool';
      });
  },
});

export default poolSlice.reducer;

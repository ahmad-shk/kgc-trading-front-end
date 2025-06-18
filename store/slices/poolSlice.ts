import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { apiGet } from '@/lib/api';

interface PoolState {
  pool: [];
  orderRresults: [];
  loading: boolean;
  error: string | null;
}

const initialState: PoolState = {
  pool: [],
  orderRresults:[],
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


// Async thunk to fetch pool data
export const fetchResultsByUser = createAsyncThunk<[], void, { rejectValue: string }>(
  'fetchResultsByUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet<{ results: [] }>('/pool-results-byUser');
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Results By User');
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

      builder
      .addCase(fetchResultsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsByUser.fulfilled, (state, action: PayloadAction<[]>) => {
        state.loading = false;
        state.orderRresults = action.payload;
      })
      .addCase(fetchResultsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch pool';
      });
  },
});

export default poolSlice.reducer;

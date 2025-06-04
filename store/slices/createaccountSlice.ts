import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
interface AuthState {
  walletAddress: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  walletAddress: "",
  loading: false,
  error: null,
};
export const createAccount = createAsyncThunk(
    "auth/createAccount",
    async (walletAddress: string, thunkAPI) => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/account", {
                walletAddress,
            });
            return response.data; // assuming API returns walletAddress in response
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.walletAddress = action.payload;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
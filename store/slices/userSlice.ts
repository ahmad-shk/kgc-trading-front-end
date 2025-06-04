// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  walletAddress: string;
}

interface UserState {
  accessToken: string | null;
  user: User | null;
  tokenType: string | null;
  message: string | null;
}

const initialState: UserState = {
  accessToken: null,
  user: null,
  tokenType: null,
  message: null,
};

interface LoginPayload {
  access_token: string;
  user: {
    username: string;
    walletAddress: string;
  };
  token_type: string;
  message: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<LoginPayload>) => {
      const { access_token, user, token_type, message } = action.payload;
      state.accessToken = access_token;
      state.user = user;
      state.tokenType = token_type;
      state.message = message;
    },
    clearUserData: (state) => {
      state.accessToken = null;
      state.user = null;
      state.tokenType = null;
      state.message = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;

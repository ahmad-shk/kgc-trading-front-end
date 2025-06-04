'use client';

// store.ts
import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleSlice';
import binanceReducer from './slices/binanceSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/createaccountSlice';
import orderReducer from './slices/orderSlice';
import poolReducer from './slices/poolSlice';


export const store = configureStore({
  reducer: {
    example: exampleReducer, // Add your slice reducers here
    binance: binanceReducer,
    user: userReducer,
    auth: authReducer,
    order: orderReducer,
    pool: poolReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
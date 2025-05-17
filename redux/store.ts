// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import themeSlice from './slices/themeSlice';
import timersReducer from './slices/timerSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    theme : themeSlice,
    timers: timersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

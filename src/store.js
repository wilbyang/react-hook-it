import { configureStore } from '@reduxjs/toolkit';
import { playlistsApi } from './services/playlistsApi';

// Centralized app store
export const store = configureStore({
  reducer: {
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(playlistsApi.middleware),
});

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    
  }),
  endpoints: () => ({}), // You will add endpoints here
});

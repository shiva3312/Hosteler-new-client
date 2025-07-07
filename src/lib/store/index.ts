//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { configureStore } from '@reduxjs/toolkit';

import contextReducer from './slice/context-slice'; // context slice
import counterReducer from './slice/counter-slice'; // example slice

export const store = configureStore({
  reducer: {
    counter: counterReducer, // add more reducers here
    context: contextReducer, // add context reducer
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

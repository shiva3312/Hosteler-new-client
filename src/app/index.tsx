//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

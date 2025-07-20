//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/core/notifications';
import { Spinner } from '@/components/ui/core/spinner';
import { env } from '@/config/env';
import { queryConfig } from '@/lib/api/react-query';

import { theme } from '../styles/theme';

import '@mantine/core/styles.css';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {!env.DEPLOYED && <ReactQueryDevtools />}
            <MantineProvider theme={theme}>
              <Notifications />
              <ModalsProvider>
                {/* <AuthLoader
                renderLoading={() => (
                  <div className="flex h-screen w-screen items-center justify-center">
                    <Spinner size="xl" />
                  </div>
                )}
              > */}
                {children}
                {/* </AuthLoader> */}
              </ModalsProvider>
            </MantineProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};

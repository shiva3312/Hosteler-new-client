//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/public/landing').then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    {
      path: paths.about.path,
      lazy: () => import('./routes/public/about').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./routes/app/dashboard/dashboard').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.analytics.path,
          lazy: () =>
            import('./routes/analytics/analytics').then(convert(queryClient)),
        },

        {
          path: paths.app.home.path,
          lazy: () =>
            import('./routes/app/home/home').then(convert(queryClient)),
        },
        {
          path: paths.app.settings.path,
          lazy: () =>
            import('./routes/app/settings/user-settings').then(
              convert(queryClient),
            ),
        },
        {
          // path: paths.app.systemSettings.path, // 'system-settings'
          children: [
            {
              index: true,
              lazy: () =>
                import(
                  './routes/app/settings/system-settings/user-management/user-management'
                ).then(convert(queryClient)),
            },
            {
              path: paths.app.systemSettings.user.path, // 'user'
              lazy: () =>
                import(
                  './routes/app/settings/system-settings/user-management/user-management'
                ).then(convert(queryClient)),
            },
            {
              path: paths.app.systemSettings.group.path, // 'group'
              lazy: () =>
                import(
                  './routes/app/settings/system-settings/group-management/group-management'
                ).then(convert(queryClient)),
            },
            {
              path: paths.app.systemSettings.system.path, // 'system'
              lazy: () =>
                import(
                  './routes/app/settings/system-settings/system-setting/system-management'
                ).then(convert(queryClient)),
            },
            {
              path: paths.app.systemSettings.feature.path, // 'feature'
              lazy: () =>
                import(
                  './routes/app/settings/system-settings/feature-management/feature-management'
                ).then(convert(queryClient)),
            },
          ],
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};

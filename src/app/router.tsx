//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/api/auth/auth';
import RoleProtectedRoute from '@/lib/api/auth/rolebased-protected-route';

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
      ErrorBoundary: env.DEPLOYED ? AppRootErrorBoundary : undefined,
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./routes/app/dashboard').then(convert(queryClient)),
        },
        {
          element: <RoleProtectedRoute />,
          children: [
            {
              path: paths.app.organization.path, // 'organization'
              index: true,
              lazy: () =>
                import('./routes/app/organization/organization').then(
                  convert(queryClient),
                ),
            },
          ],
        },
        {
          element: <RoleProtectedRoute />,
          children: [
            {
              path: paths.app.unit.path, // 'unit'
              lazy: () =>
                import('./routes/app/unit/unit').then(convert(queryClient)),
            },
          ],
        },
        {
          element: <RoleProtectedRoute />,
          children: [
            {
              index: true,
              lazy: () =>
                import('./routes/app/mess/mess').then(convert(queryClient)),
            },
            {
              path: paths.app.mess.mess.path, // 'mess'
              lazy: () =>
                import('./routes/app/mess/mess').then(convert(queryClient)),
            },
            {
              path: paths.app.mess.mealItem.path,
              lazy: () =>
                import('./routes/app/mess/meal-item').then(
                  convert(queryClient),
                ),
            },
            {
              path: paths.app.mess.mealPreference.path,
              lazy: () =>
                import('./routes/app/mess/meal-preference').then(
                  convert(queryClient),
                ),
            },
            {
              path: paths.app.mess.menu.path,
              lazy: () =>
                import('./routes/app/mess/menu').then(convert(queryClient)),
            },
            {
              path: paths.app.mess.menuCycle.path,
              lazy: () =>
                import('./routes/app/mess/menu-cycle').then(
                  convert(queryClient),
                ),
            },
            {
              path: paths.app.mess.mealChart.path,
              lazy: () =>
                import('./routes/app/mess/meal-chart').then(
                  convert(queryClient),
                ),
            },
          ],
        },
        {
          path: paths.app.member.path,
          lazy: () =>
            import('./routes/app/member/member').then(convert(queryClient)),
        },
        {
          path: paths.app.settings.path,
          lazy: () =>
            import('./routes/app/settings/user-settings/').then(
              convert(queryClient),
            ),
        },
        {
          // path: paths.app.systemSettings.path, // 'system-settings'
          element: <RoleProtectedRoute />,
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

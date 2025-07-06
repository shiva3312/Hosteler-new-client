//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  about: {
    path: '/about',
    getHref: () => '/about',
  },
  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    home: {
      path: 'home',
      getHref: () => '/app/home',
    },
    dashboard: {
      path: 'dashboard',
      getHref: () => '/app/dashboard',
    },
    analytics: {
      path: 'analytics',
      getHref: () => '/app/analytics',
    },
    settings: {
      path: 'settings',
      getHref: () => '/app/settings',
    },
    systemSettings: {
      path: 'system-settings',
      getHref: () => '/app/system-settings',
      user: {
        path: 'system-settings/user',
        getHref: () => '/app/system-settings/user',
      },
      group: {
        path: 'system-settings/group',
        getHref: () => '/app/system-settings/group',
      },
      feature: {
        path: 'system-settings/feature',
        getHref: () => '/app/system-settings/feature',
      },
      system: {
        path: 'system-settings/system',
        getHref: () => '/app/system-settings/system',
      },
    },
  },
} as const;

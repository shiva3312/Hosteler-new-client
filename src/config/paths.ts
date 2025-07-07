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
    dashboard: {
      path: 'dashboard',
      getHref: () => '/app/dashboard',
    },
    organization: {
      path: 'organization',
      getHref: () => '/app/organization',
    },
    unit: {
      path: 'unit',
      getHref: () => '/app/unit',
    },
    member: {
      path: 'member',
      getHref: () => '/app/member',
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
    mess: {
      path: 'mess',
      getHref: () => '/app/mess',
      mess: {
        path: 'mess',
        getHref: () => '/app/mess',
      },
      mealItem: {
        path: 'mess/meal-item',
        getHref: () => '/app/mess/meal-item',
      },
      mealPreference: {
        path: 'mess/meal-preference',
        getHref: () => '/app/mess/meal-preference',
      },
      menu: {
        path: 'mess/menu',
        getHref: () => '/app/mess/menu',
      },
      menuCycle: {
        path: 'mess/menu-cycle',
        getHref: () => '/app/mess/menu-cycle',
      },
      mealChart: {
        path: 'mess/meal-chart',
        getHref: () => '/app/mess/meal-chart',
      },
    },
    inventory: {
      path: 'inventory',
      getHref: () => '/app/inventory',
      ingredient: {
        path: 'inventory/ingredient',
        getHref: () => '/app/inventory/ingredient',
      },
      supply: {
        path: 'inventory/supply',
        getHref: () => '/app/inventory/supply',
      },
    },
    finance: {
      path: 'finance',
      getHref: () => '/app/finance',
      supplier: {
        path: 'finance/supplier',
        getHref: () => '/app/finance/supplier',
      },
      billing: {
        path: 'finance/billing',
        getHref: () => '/app/finance/billing',
      },
      payment: {
        path: 'finance/payment',
        getHref: () => '/app/finance/payment',
      },
      purchase: {
        path: 'finance/purchase',
        getHref: () => '/app/finance/purchase',
      },
      sale: {
        path: 'finance/sales',
        getHref: () => '/app/finance/sale',
      },
    },
  },
} as const;

//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
export enum GeneralAction {
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  CREATE = 'create',
}

export enum UserManagementActions {
  CREATE_ROLE = 'create_role',
  DELETE_ROLE = 'delete_role',
  UPDATE_ROLE = 'update_role',
  READ_ROLE = 'read_role',
  CREATE_USER = 'create_user',
  DELETE_USER = 'delete_user',
  UPDATE_USER = 'update_user',
  READ_USER = 'read_user',
}

const ACTIONS = {
  ...GeneralAction,
  ...UserManagementActions,
} as const;

export type ActionEnumType = (typeof ACTIONS)[keyof typeof ACTIONS];

export enum Environment {
  PROD = 'pro',
  DEV = 'dev',
  QA = 'qa',
}

export enum UserRole {
  MASTER_ADMIN = 'master_admin', // Full access across all environments
  SUPER_ADMIN = 'super_admin', // Full access across all organizations
  ADMIN = 'admin', // Admin access limited to a specific unit
  SUPPORT = 'support', // Limited access for support purposes
  USER = 'user', // Regular user with basic access
  GUEST = 'guest', // Limited access, typically read-only
}

export enum Feature {
  USER_MANAGEMENT = 'user_management',
  ROLE_MANAGEMENT = 'role_management',
  BILLING = 'billing',
  REPORTING = 'reporting',
  NOTIFICATIONS = 'notifications',
  SETTINGS = 'settings',
  DASHBOARD = 'dashboard',
}

export interface AppFeature {
  name: Feature;
  description: string;
  environment: Environment;
  actions: ActionEnumType[];
  requiredRole: UserRole[];
}

export const ApplicationFeature: AppFeature[] = [
  {
    name: Feature.USER_MANAGEMENT,
    description:
      'Manage users, including operations like create, read, update, and delete user profiles and user roles.',
    environment: Environment.PROD,
    actions: [
      UserManagementActions.CREATE_USER,
      UserManagementActions.READ_USER,
      UserManagementActions.UPDATE_USER,
      UserManagementActions.DELETE_USER,
      UserManagementActions.CREATE_ROLE,
      UserManagementActions.READ_ROLE,
      UserManagementActions.UPDATE_ROLE,
      UserManagementActions.DELETE_ROLE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
    ],
  },
  {
    name: Feature.ROLE_MANAGEMENT,
    description:
      'Define and manage roles with specific requiredRole for different functionalities.',
    environment: Environment.PROD,
    actions: [
      GeneralAction.CREATE,
      GeneralAction.READ,
      GeneralAction.UPDATE,
      GeneralAction.DELETE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
    ],
  },
  {
    name: Feature.BILLING,
    description:
      'Handle billing processes, including subscription management, invoice generation, and payment tracking.',
    environment: Environment.PROD,
    actions: [
      GeneralAction.CREATE,
      GeneralAction.READ,
      GeneralAction.UPDATE,
      GeneralAction.DELETE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
    ],
  },
  {
    name: Feature.REPORTING,
    description:
      'Generate and view reports, such as usage statistics, activity logs, or financial summaries.',
    environment: Environment.PROD,
    actions: [
      GeneralAction.CREATE,
      GeneralAction.READ,
      GeneralAction.UPDATE,
      GeneralAction.DELETE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
      UserRole.USER,
      UserRole.GUEST,
    ],
  },
  {
    name: Feature.NOTIFICATIONS,
    description:
      'Manage notification settings, including email, SMS, and in-app notifications.',
    environment: Environment.PROD,
    actions: [
      GeneralAction.CREATE,
      GeneralAction.READ,
      GeneralAction.UPDATE,
      GeneralAction.DELETE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
      UserRole.USER,
      UserRole.GUEST,
    ],
  },
  {
    name: Feature.SETTINGS,
    description:
      'Modify application settings, such as preferences, themes, and integrations.',
    environment: Environment.PROD,
    actions: [
      GeneralAction.CREATE,
      GeneralAction.READ,
      GeneralAction.UPDATE,
      GeneralAction.DELETE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
    ],
  },
  {
    name: Feature.DASHBOARD,
    description:
      'Provide a personalized dashboard displaying key metrics, charts, and insights.',
    environment: Environment.PROD,
    actions: [
      GeneralAction.CREATE,
      GeneralAction.READ,
      GeneralAction.UPDATE,
      GeneralAction.DELETE,
    ],
    requiredRole: [
      UserRole.MASTER_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.SUPPORT,
    ],
  },
];

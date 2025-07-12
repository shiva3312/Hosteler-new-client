//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import * as React from 'react';

import { UserRole } from '@/data/feature';

import { useMe } from '../user/get-me';

// available permissions
const Permissions = {
  // org/unit actions
  organization_read: 'organization:read',
  organization_write: 'organization:write',
  organization_manage: 'organization:manage',

  unit_read: 'unit:read',
  unit_write: 'unit:write',
  unit_manage: 'unit:manage',

  dashboard_read: 'dashboard:read',
  dashboard_write: 'dashboard:write',
  dashboard_manage: 'dashboard:manage',

  user_read: 'user_profile:read',
  user_write: 'user_profile:write',
  user_manage: 'user_profile:manage',

  meal_status_read: 'meal_status:read',
  meal_status_write: 'meal_status:write',
  meal_status_manage: 'meal_status:manage',
};

// available actions
export const enum Action {
  // org/unit selections drop down
  organization_select = 'organization_select',
  unit_select = 'unit_select',

  // dashboard actions
  summary_dashboard = 'summary_dashboard',

  // user  actions
  user_profile = 'user_profile',

  // meal status actions
  user_config_in_dashboard = 'user_config_in_dashboard',
}

// Temporary user permissions and roles of user.
// const TEMPORARY_ROLES: UserRole[] = [
//   UserRole.MASTER_ADMIN,
//   // UserRole.SUPER_ADMIN,
//   // UserRole.ADMIN,
//   // UserRole.USER,
//   // UserRole.GUEST,
// ];
// const TEMPORARY_PERMISSIONS: string[] = [
//   // Changed type from Permissions to string[]
//   // Permissions.organization_read,
//   // Permissions.organization_write,
//   // Permissions.organization_manage,
//   // Permissions.unit_read,
//   // Permissions.unit_write,
//   // Permissions.unit_manage,
// ];

// required roles and permissions for each action
const REQUIRED_ROLE_OR_PERMISSION_FOR_ACTIONS: Record<
  Action,
  { requiredRole: UserRole[]; requiredPermissions?: string[] }
> = {
  // org/unit selections drop down
  organization_select: {
    requiredRole: [UserRole.MASTER_ADMIN],
    requiredPermissions: [
      Permissions.organization_read,
      Permissions.organization_manage,
      Permissions.organization_write,
    ],
  },
  unit_select: {
    requiredRole: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN],
    requiredPermissions: [
      Permissions.unit_read,
      Permissions.unit_write,
      Permissions.unit_manage,
    ],
  },

  summary_dashboard: {
    requiredRole: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    requiredPermissions: [
      Permissions.dashboard_read,
      Permissions.dashboard_write,
      Permissions.dashboard_manage,
    ],
  },

  user_profile: {
    requiredRole: Object.values(UserRole),
    requiredPermissions: [
      Permissions.user_read,
      Permissions.user_write,
      Permissions.user_manage,
    ],
  },

  user_config_in_dashboard: {
    requiredRole: Object.values(UserRole),
    requiredPermissions: [
      Permissions.meal_status_read,
      Permissions.meal_status_write,
      Permissions.meal_status_manage,
    ],
  },
};

export const useAuthorization = () => {
  const { data: user } = useMe();
  // const user = undefined as any; // Replace with actual user fetching logic

  const { roles, permissions } = user?.data ?? {
    roles: [] as UserRole[],
    permissions: [] as string[],
  };

  const checkAccess = React.useCallback(
    (action: Action) => {
      if (!action || !REQUIRED_ROLE_OR_PERMISSION_FOR_ACTIONS[action]) {
        return false;
      }

      const { requiredRole, requiredPermissions } =
        REQUIRED_ROLE_OR_PERMISSION_FOR_ACTIONS[action];

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRole.some((role: UserRole) =>
        roles.includes(role as UserRole),
      );

      // Check if user has any of the required permissions
      const hasRequiredPermission = (requiredPermissions ?? []).some(
        (permission) => (permissions ?? []).includes(permission),
      );

      return hasRequiredRole || hasRequiredPermission;
    },
    [roles, permissions],
  );

  return {
    checkAccess,
    roles,
    permissions,
  };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
  action: keyof typeof Action;
};

export const Authorization = ({
  action,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (action) {
    canAccess = checkAccess(action as Action);
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

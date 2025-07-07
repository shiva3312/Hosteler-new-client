//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import * as React from 'react';

import { UserRole } from '@/data/feature';

// available permissions
const Permissions = {
  // org/unit actions
  organization_read: 'organization:read',
  organization_write: 'organization:write',
  organization_manage: 'organization:manage',

  unit_read: 'unit:read',
  unit_write: 'unit:write',
  unit_manage: 'unit:manage',
};

// available actions
export const enum Action {
  // org/unit selections drop down
  organization_select = 'organization_select',
  unit_select = 'unit_select',
}

// Temporary user permissions and roles of user.
const TEMPORARY_ROLES: UserRole[] = [
  UserRole.MASTER_ADMIN,
  // UserRole.SUPER_ADMIN,
  // UserRole.ADMIN,
  // UserRole.USER,
  // UserRole.GUEST,
];
const TEMPORARY_PERMISSIONS: string[] = [
  // Changed type from Permissions to string[]
  // Permissions.organization_read,
  // Permissions.organization_write,
  // Permissions.organization_manage,
  // Permissions.unit_read,
  // Permissions.unit_write,
  // Permissions.unit_manage,
];

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
};

export const useAuthorization = () => {
  // const user = useUser();
  const user = undefined as any; // Replace with actual user fetching logic

  const { roles, permissions } = user?.data || {
    roles: TEMPORARY_ROLES,
    permissions: TEMPORARY_PERMISSIONS,
  };

  // if (!user?.data) {
  //   throw Error('User does not exist!');
  // }

  const checkAccess = React.useCallback(
    (action: Action) => {
      if (!action || !REQUIRED_ROLE_OR_PERMISSION_FOR_ACTIONS[action]) {
        return false;
      }

      const { requiredRole, requiredPermissions } =
        REQUIRED_ROLE_OR_PERMISSION_FOR_ACTIONS[action];

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRole.some((role) => roles.includes(role));

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
    canAccess = checkAccess(action);
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

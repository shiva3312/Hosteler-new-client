//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import * as React from 'react';

import { UserRole } from '@/data/feature';
import { UserResponse } from '@/interfaces/user.interface';
import { Comment } from '@/types/api';

import { useUser } from './auth';

export const POLICIES = {
  'comment:delete': (user: UserResponse, comment: Comment) => {
    if (user.role !== UserRole.GUEST && user.role !== UserRole.USER) {
      return true;
    }

    if (user.role === UserRole.USER && comment.author?.id === user._id) {
      return true;
    }

    return false;
  },
};

export const useAuthorization = () => {
  const user = useUser();

  if (!user.data) {
    throw Error('User does not exist!');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles?.includes(user.data.role ?? UserRole.GUEST);
      }

      return true;
    },
    [user.data],
  );

  return { checkAccess, role: user.data.role };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: UserRole[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({
      allowedRoles: allowedRoles?.map((role) => role) as UserRole[],
    });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

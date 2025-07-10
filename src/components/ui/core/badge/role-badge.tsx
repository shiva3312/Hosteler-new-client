//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Badge, type BadgeProps } from '@mantine/core';
import React from 'react';

import { UserRole } from '@/data/feature';

interface CustomBadgeProps extends BadgeProps {
  role: UserRole;
}

// Define default props for your RoleBadge component
const defaultProps: CustomBadgeProps = {
  variant: 'light', // Default variant
  color: '#000000', // Default color
  role: UserRole.GUEST, // Default Role
};

const getColorForRole = (role: UserRole) => {
  switch (role) {
    case UserRole.MASTER_ADMIN:
      return { formattedRole: 'Master Admin', colorCode: 'purple' }; // High authority, distinct
    case UserRole.SUPER_ADMIN:
      return { formattedRole: 'Super Admin', colorCode: 'red' }; // Critical role
    case UserRole.ADMIN:
      return { formattedRole: 'Admin', colorCode: 'orange' }; // Elevated access
    case UserRole.USER:
      return { formattedRole: 'User', colorCode: 'blue' }; // Standard users
    case UserRole.GUEST:
      return { formattedRole: 'Guest', colorCode: 'gray' }; // Temporary/limited role
    default:
      return { formattedRole: role ?? 'Unknown', colorCode: 'slate' }; // Fallback
  }
};

const RoleBadge: React.FC<CustomBadgeProps> = ({
  role,
  ...badgeProps
}: CustomBadgeProps) => {
  const { formattedRole, colorCode } = getColorForRole(role);
  return (
    <Badge {...badgeProps} color={colorCode}>
      {formattedRole}
    </Badge>
  );
};

RoleBadge.defaultProps = defaultProps;
export default RoleBadge;

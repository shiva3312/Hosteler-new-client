//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Badge, type BadgeProps } from '@mantine/core';
import React from 'react';

interface EnumBadgeProps<T extends string | number | symbol>
  extends BadgeProps {
  value: T; // The enum value to display
  colorMap?: Record<T, string>; // A mapping of enum values to colors
  labelMap?: Record<T, string>; // Optional mapping of enum values to display labels
}

// Define default props for your RoleBadge component
const defaultProps: EnumBadgeProps<string> = {
  variant: 'light',
  color: '#000000',
  value: '',
};

// Generic EnumBadge Component
const EnumBadge = <T extends string | number>({
  value,
  colorMap,
  labelMap,
  ...badgeProps
}: EnumBadgeProps<T>) => {
  const color = colorMap?.[value] || 'gray'; // Default to gray if no color is provided
  const label = labelMap?.[value] || value; // Default to the enum value if no label is provided

  return (
    <Badge {...badgeProps} color={color} tt={'capitalize'}>
      {label}
    </Badge>
  );
};

EnumBadge.defaultProps = defaultProps;
export default EnumBadge;

/**
 * Utility function to create a badge component for any enum type.
 * @param enumObj - The enum object containing the values and labels.
 * @param colorMap - A mapping of enum values to colors.
 * @param componentName - The name of the component for display purposes.
 * @param defaultProps - Optional default props to apply to the badge component.
 * @returns A React component that renders a badge for the given enum value.
 */

type EnumType = Record<string, string>;

export const createBadgeComponent = <T extends EnumType>(
  enumObj: T,
  colorMap: Record<keyof T, string>,
  componentName: string,
  defaultProps?: React.ComponentProps<typeof EnumBadge>,
) => {
  const BadgeComponent: React.FC<
    { value: keyof T } & React.ComponentProps<typeof EnumBadge>
  > = ({ value, ...badgeProps }) => {
    return (
      <EnumBadge
        {...defaultProps} // Apply predefined props
        {...badgeProps} // Allow runtime overrides
        value={value}
        colorMap={colorMap}
        labelMap={enumObj}
      />
    );
  };

  BadgeComponent.displayName = componentName;
  return BadgeComponent;
};

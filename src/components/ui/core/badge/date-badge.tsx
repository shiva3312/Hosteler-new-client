//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Badge, type BadgeProps } from '@mantine/core';
import React from 'react';

import { formatDateWithColor } from '@/utils/format';

interface CustomBadgeProps extends BadgeProps {
  prefix?: string;
  date: string | number | Date;
  time?: boolean;
}

// Define default props for your DateBadge component
const defaultProps: CustomBadgeProps = {
  variant: 'light', // Default variant
  color: '#000000', // Default color
  date: new Date().toString(), // Default Date
};

const DateBadge: React.FC<CustomBadgeProps> = ({
  date,
  time,
  prefix,
  ...badgeProps
}: CustomBadgeProps) => {
  const { formattedDate, colorCode } = formatDateWithColor(date, time);
  return (
    <Badge {...badgeProps} color={colorCode}>
      {`${prefix ?? ''} ${formattedDate}`}
    </Badge>
  );
};

DateBadge.defaultProps = defaultProps;
export default DateBadge;

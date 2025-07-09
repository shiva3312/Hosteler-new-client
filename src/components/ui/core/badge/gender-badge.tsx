//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import React from 'react';

import EnumBadge from '@/components/ui/core/badge/generic-badge';
import { Gender } from '@/interfaces/enums';

interface GenderBadgeProps extends React.ComponentProps<typeof EnumBadge> {
  value: Gender;
}

const GenderBadge: React.FC<GenderBadgeProps> = ({
  value,
  ...badgeProps
}: GenderBadgeProps) => {
  // Define the color map for Gender
  const genderColorMap = {
    [Gender.Male]: 'blue',
    [Gender.Female]: 'pink',
    [Gender.Transgender]: 'purple',
    [Gender.Other]: 'gray',
  };

  return (
    <EnumBadge
      {...badgeProps}
      value={value}
      colorMap={genderColorMap}
      labelMap={Gender}
    />
  );
};

export default GenderBadge;

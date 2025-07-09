//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import React from 'react';

import EnumBadge from '@/components/ui/core/badge/generic-badge';
import { MealType } from '@/interfaces/enums';

interface MealTypeBadgeProps extends React.ComponentProps<typeof EnumBadge> {
  value: MealType;
}

const MealTypeBadge: React.FC<MealTypeBadgeProps> = ({
  value,
  ...badgeProps
}: MealTypeBadgeProps) => {
  // Define the color map for MealType
  const mealTypeColorMap = {
    [MealType.Vegetarian]: 'green',
    [MealType.NonVegetarian]: 'red',
    [MealType.Vegan]: 'yellow',
    [MealType.Eggetarian]: 'gray',
    [MealType.AllEater]: 'purple',
  };

  // Define the label map for MealType
  const mealTypeLabelMap = {
    [MealType.Vegetarian]: 'Vegetarian',
    [MealType.NonVegetarian]: 'Non-Vegetarian',
    [MealType.Vegan]: 'Vegan',
    [MealType.Eggetarian]: 'Eggetarian',
    [MealType.AllEater]: 'All Eater',
  };

  return (
    <EnumBadge
      {...badgeProps}
      value={value}
      colorMap={mealTypeColorMap}
      labelMap={mealTypeLabelMap} // Explicitly pass the label map
    />
  );
};

export default MealTypeBadge;

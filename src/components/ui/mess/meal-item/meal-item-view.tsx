//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { MealItemResponse } from '@/interfaces/mess/meal-item.interface';

interface MealItemProfileImageProps {
  mealItem: MealItemResponse;
}

function MealItemProfileImage({ mealItem }: MealItemProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {mealItem.name}
      </Text>
    </Group>
  );
}

export default MealItemProfileImage;

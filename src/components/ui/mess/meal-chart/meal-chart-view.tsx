//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';

interface MealChartProfileImageProps {
  mealChart: MealChartResponse;
}

function MealChartProfileImage({ mealChart }: MealChartProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {mealChart.name}
      </Text>
    </Group>
  );
}

export default MealChartProfileImage;

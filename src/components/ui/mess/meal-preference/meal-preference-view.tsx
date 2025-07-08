//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { MealPreferenceResponse } from '@/interfaces/mess/meal-preference.interface';

interface MealPreferenceProfileImageProps {
  mealPreference: MealPreferenceResponse;
}

function MealPreferenceProfileImage({
  mealPreference,
}: MealPreferenceProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {mealPreference._id}
      </Text>
    </Group>
  );
}

export default MealPreferenceProfileImage;

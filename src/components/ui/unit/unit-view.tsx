//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { UnitResponse } from '@/interfaces/unit.interface';

interface UnitProfileImageProps {
  unit: UnitResponse;
}

function UnitProfileImage({ unit }: UnitProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {unit.name}
      </Text>
    </Group>
  );
}

export default UnitProfileImage;

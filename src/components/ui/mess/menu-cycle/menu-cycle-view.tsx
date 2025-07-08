//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { MenuCycleResponse } from '@/interfaces/mess/menu-cycle.interface';

interface MenuCycleProfileImageProps {
  menuCycle: MenuCycleResponse;
}

function MenuCycleProfileImage({ menuCycle }: MenuCycleProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {menuCycle.name}
      </Text>
    </Group>
  );
}

export default MenuCycleProfileImage;

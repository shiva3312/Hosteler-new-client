//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { MenuResponse } from '@/interfaces/mess/menu.interface';

interface MenuProfileImageProps {
  menu: MenuResponse;
}

function MenuProfileImage({ menu }: MenuProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {menu.name}
      </Text>
    </Group>
  );
}

export default MenuProfileImage;

//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { GroupResponse } from '@/interfaces/group.interface';

interface GroupProfileImageProps {
  group: GroupResponse;
}

function GroupProfileImage({ group }: GroupProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {group.name}
      </Text>
    </Group>
  );
}

export default GroupProfileImage;

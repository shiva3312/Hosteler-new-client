//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { MessResponse } from '@/interfaces/mess/mess.interface';

interface MessProfileImageProps {
  mess: MessResponse;
}

function MessProfileImage({ mess }: MessProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {mess.name}
      </Text>
    </Group>
  );
}

export default MessProfileImage;

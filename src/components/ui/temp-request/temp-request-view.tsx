//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { TempRequestResponse } from '@/interfaces/temp-request.interface';

interface TempRequestProfileImageProps {
  tempRequest: TempRequestResponse;
}

function TempRequestProfileImage({
  tempRequest,
}: TempRequestProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {tempRequest.name}
      </Text>
    </Group>
  );
}

export default TempRequestProfileImage;

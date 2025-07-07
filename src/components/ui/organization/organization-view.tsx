//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';

import { OrganizationResponse } from '@/interfaces/organization.interface';

interface OrganizationProfileImageProps {
  organization: OrganizationResponse;
}

function OrganizationProfileImage({
  organization,
}: OrganizationProfileImageProps) {
  return (
    <Group gap="sm">
      {/* <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} /> */}
      <Text fz="sm" fw={500}>
        {organization.name}
      </Text>
    </Group>
  );
}

export default OrganizationProfileImage;

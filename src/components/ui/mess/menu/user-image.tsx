//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Avatar, Group, Text } from '@mantine/core';
import React from 'react';

import { GroupResponse } from '@/interfaces/group.interface';
import { UserResponse } from '@/interfaces/user.interface';

interface UserProfileImageProps {
  user: UserResponse;
}

function UserProfileImage({ user }: UserProfileImageProps) {
  const placeHolderImage = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${user.username}&gender=${user.profile?.gender}`;

  return (
    <Group gap="sm">
      <Avatar variant="gradient" size={40} src={placeHolderImage} radius={40} />
      <Text fz="sm" fw={500}>
        {user.username}
        <Text fz="xs" c="dimmed" ml={5}>
          {user.group?.name ?? 'No Group'}
        </Text>
      </Text>
    </Group>
  );
}

export default UserProfileImage;

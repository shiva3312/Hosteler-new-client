//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';
import React from 'react';

import { UserRole } from '@/data/feature';
import { ImageSize } from '@/interfaces/enums';
import { UserResponse } from '@/interfaces/user.interface';

import { UserProfileImage } from '../core/file-hanling/user-image';

interface UserProfileImageProps {
  user: UserResponse;
}

function UserListAvatar({ user }: UserProfileImageProps) {
  return (
    <Group gap="sm">
      <UserProfileImage
        url={user.imageUrl ?? ''}
        type={ImageSize.Small}
        dicebearImage={{
          id: user.username,
          gender: user.profile?.gender ?? undefined,
        }}
      />

      <Text fz="sm" fw={500}>
        {user.roles[0] === UserRole.GUEST && user.roles.length === 1
          ? `Guest_${user.profile?.firstName}`.toLowerCase()
          : user.username}
        <Text fz="xs" c="dimmed" ml={5}>
          {user.group ?? 'No Group'}
        </Text>
      </Text>
    </Group>
  );
}

export default UserListAvatar;

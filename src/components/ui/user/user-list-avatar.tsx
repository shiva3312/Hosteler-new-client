//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Group, Text } from '@mantine/core';
import React from 'react';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { UserRole } from '@/data/feature';
import { ImageSize } from '@/interfaces/enums';
import { UserResponse } from '@/interfaces/user.interface';
import { useUser } from '@/lib/api/user/get-user';

import { UserProfileImage } from '../core/file-hanling/user-image';

interface UserAvatarProps {
  user: UserResponse | string;
}

export const getUserName = (user?: UserResponse) => {
  if (!user) return 'No Name';
  if (user.roles.includes(UserRole.GUEST) && user.roles.length === 1) {
    return `Guest_${user.profile?.firstName ?? 'No Name'}`.toLowerCase();
  }

  return user.username || user.profile?.firstName || 'No Name';
};

function UserAvatar({ user }: UserAvatarProps) {
  const { data: userData, isLoading } = useUser({
    user: typeof user === 'string' ? user : user._id,
    queryConfig: {
      enabled: typeof user === 'string',
    },
  });

  const currUser = typeof user === 'string' ? userData?.data : user;

  const data = {
    imageUrl: currUser?.imageUrl ?? '',
    imageType: ImageSize.Small,
    username: currUser?.username ?? 'n/a',
    gender: currUser?.profile?.gender ?? undefined,
    group: currUser?.group ?? 'No Group',
    roles: currUser?.roles ?? [],
    firstName: currUser?.profile?.firstName ?? 'No Name',
  };

  return (
    <LoaderWrapper isLoading={isLoading} loaderType="avatar">
      <Group gap="sm">
        <UserProfileImage
          url={data.imageUrl}
          type={data.imageType}
          dicebearImage={{
            id: data.username,
            gender: data.gender,
          }}
        />

        <Text fz="sm" fw={500}>
          {getUserName(currUser)}
          <Text fz="xs" c="dimmed" ml={5}>
            {data.group ?? 'No Group'}
          </Text>
        </Text>
      </Group>
    </LoaderWrapper>
  );
}

export default UserAvatar;

//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Card, Text } from '@mantine/core';

import { ImageSize } from '@/interfaces/enums';
import { useMe } from '@/lib/api/user/get-me';

import { UserProfileImage } from '../core/file-hanling/user-image';

export function UserCardImage() {
  const { data: user } = useMe();

  return (
    <Card withBorder padding="xl" radius="md">
      <Card.Section
        h={140}
        style={{
          background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        }}
      />
      <UserProfileImage
        url={user?.data.imageUrl ?? ''}
        type={ImageSize.Original}
        dicebearImage={{
          id: user?.data.username,
          gender: user?.data.profile?.gender ?? undefined,
        }}
        mt={-50}
      />

      <Text ta="center" fz="lg" fw={500} mt="sm">
        {`${user?.data.profile?.firstName ?? ''} ${user?.data.profile?.lastName ?? ''}`.trim() ||
          'User Name'}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {`${user?.data.username}`}
      </Text>
    </Card>
  );
}

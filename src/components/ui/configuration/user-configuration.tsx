//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Box,
  Card,
  ColorSwatch,
  Divider,
  Flex,
  Group,
  Switch,
  Text,
} from '@mantine/core';

import { MealStatus, UserStatus } from '@/interfaces/enums';
import { useMe } from '@/lib/api/user/get-me';
import { useUpdateUser } from '@/lib/api/user/update-profile';

import RoleBadge from '../core/badge/role-badge';
import { useNotifications } from '../core/notifications';

const data = [
  {
    id: 'meal-status',
    title: 'Meal Status',
    type: 'checkBox',
    description: 'On/Off meal status will include/exclude in daily chart',
  },
  {
    id: 'user-status',
    title: 'User Status',
    type: 'checkBox',
    description:
      'On/Off user status will mark user as active/inactive in the hostel',
  },
];

export function SwitchesCard() {
  const { data: user, refetch } = useMe();
  const { addNotification } = useNotifications();

  const updateProfileMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        refetch();
        addNotification({
          type: 'success',
          title: 'Status Updated',
        });
      },
    },
  });

  const updateMealStatus = (mealStatus: MealStatus) => {
    if (user?.data.mealStatus === MealStatus.Disabled) {
      addNotification({
        type: 'warning',
        title: 'Meal Status is Disabled',
        message: 'Please ask you Admin to enable meal status.',
      });

      return;
    }

    updateProfileMutation.mutate({
      userId: user?.data?._id ?? '',
      data: { mealStatus: mealStatus },
    });
  };

  const updateUserStatus = (status: UserStatus) => {
    if (
      user?.data.status === UserStatus.Disabled ||
      user?.data.status === UserStatus.Banned
    ) {
      addNotification({
        type: 'warning',
        title: 'User Status is Disabled/Banned',
        message: 'Please ask your Admin to enable user status.',
      });

      return;
    }

    updateProfileMutation.mutate({
      userId: user?.data?._id ?? '',
      data: { status },
    });
  };

  const items = data.map((item) => (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap="xl"
      key={item.title}
      mb={'md'}
    >
      <div>
        <Text>{item.title}</Text>
        <Text size="xs" c="dimmed">
          {item.description}
        </Text>
      </div>
      <Switch
        onLabel={
          item.id === 'meal-status'
            ? user?.data.mealStatus
            : item.id === 'user-status'
              ? user?.data.status
              : ''
        }
        offLabel={
          item.id === 'meal-status'
            ? user?.data.mealStatus
            : item.id === 'user-status'
              ? user?.data.status
              : ''
        }
        checked={
          item.id === 'meal-status'
            ? user?.data.mealStatus === MealStatus.Active
            : item.id === 'user-status'
              ? user?.data.status === UserStatus.Active
              : false
        }
        onChange={(e) => {
          if (item.id === 'meal-status') {
            if (e.target.checked) {
              updateMealStatus(MealStatus.Active);
            } else {
              updateMealStatus(MealStatus.Inactive);
            }
          } else if (item.id === 'user-status') {
            if (e.target.checked) {
              updateUserStatus(UserStatus.Active);
            } else {
              updateUserStatus(UserStatus.Inactive);
            }
          }
        }}
        size="lg"
      />
    </Group>
  ));

  return (
    <Card withBorder radius="md" p="xl">
      {items}

      <Divider m={'lg'} />
      <Group
        justify="space-between"
        wrap="nowrap"
        gap="xl"
        key={'role-permissions'}
      >
        <Box maw={'60%'}>
          <Text>Role & Permissions</Text>
          <Text size="xs" c="dimmed">
            Roles are used to define user permissions and access levels.
          </Text>
        </Box>
        <Flex wrap={'wrap'} gap={'xs'}>
          {user?.data.roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </Flex>
      </Group>
    </Card>
  );
}

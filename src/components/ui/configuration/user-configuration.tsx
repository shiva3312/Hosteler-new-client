//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Card, Divider, Flex, Group, Switch, Text } from '@mantine/core';

import { MealStatus } from '@/interfaces/enums';
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
          title: 'Meal Status Updated',
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

  const items = data.map((item) => (
    <Group justify="space-between" wrap="nowrap" gap="xl" key={item.title}>
      <div>
        <Text>{item.title}</Text>
        <Text size="xs" c="dimmed">
          {item.description}
        </Text>
      </div>
      <Switch
        onLabel="ON"
        offLabel={
          user?.data.mealStatus === MealStatus.Disabled ? 'Disabled' : 'OFF'
        }
        checked={user?.data.mealStatus === MealStatus.Active}
        onChange={(e) => {
          if (e.target.checked) {
            updateMealStatus(MealStatus.Active);
          } else {
            updateMealStatus(MealStatus.Inactive);
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

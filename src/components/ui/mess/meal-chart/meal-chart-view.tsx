//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Card,
  Grid,
  Text,
  Table,
  Group,
  Button,
  Center,
  Checkbox,
} from '@mantine/core';
import { useMemo } from 'react';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { CreateToViewMealChart } from '@/interfaces/mess/meal-chart.interface';
import { UserResponse } from '@/interfaces/user.interface';
import { useMealChartsToView } from '@/lib/api/mess/meal-chart/create-to-view-meal-chart';
import { useUsers } from '@/lib/api/user/get-users';

import { MealTypeBadge } from '../../core/badge/enum-badage';
import UserAvatar from '../../user/user-list-avatar';

const MealChartView = ({
  mealChartType,
  menuType,
  unit,
  organization,
}: CreateToViewMealChart) => {
  const {
    data: mealChart,
    isLoading,
    refetch,
  } = useMealChartsToView({
    params: {
      unit,
      organization,
      menuType,
      mealChartType,
    },
    enabled: !!unit && !!organization,
  });

  const {
    name,
    description,
    type,
    // serveTime,
    extraMealCount,
    userWithMealPreference = [],
  } = mealChart?.data || {};

  const { data: users } = useUsers();

  const userIdMap: Record<string, UserResponse> = useMemo(() => {
    return (
      users?.data.reduce(
        (acc: Record<string, UserResponse>, user) => {
          acc[user._id] = user;
          return acc;
        },
        {} as Record<string, UserResponse>,
      ) || {}
    );
  }, [users?.data]);

  return (
    <LoaderWrapper isLoading={isLoading}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* Header */}
        <Card.Section>
          <Group mb="md">
            <Text fw={700} size="lg">
              {name}
            </Text>
            <Text color="dimmed">{type}</Text>
          </Group>
          <Text size="sm" color="dimmed">
            {description || 'No description available'}
          </Text>

          <Button onClick={() => refetch()} loading={isLoading}>
            Refresh
          </Button>
        </Card.Section>

        {/* Body */}
        <Card.Section mt="md">
          {/* Top: Summary */}
          <Grid>
            <Grid.Col span={6}>
              <Text fw={500}>Serve Time:</Text>
              {/* <Text size="sm">
              {startTime} - {endTime}
            </Text> */}
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={500}>Extra Meal Count:</Text>
              <Text size="sm">{extraMealCount}</Text>
            </Grid.Col>
          </Grid>

          {/* Bottom: List of Students */}
          <Table m="md" striped highlightOnHover>
            <thead>
              <tr>
                <th align="left">Verified</th>
                <th align="left">User</th>
                <th align="left">Room</th>
                <th align="left">Meal Type</th>
                {/* <th align="left">Items</th> */}
              </tr>
            </thead>
            <tbody>
              {userWithMealPreference.length > 0 ? (
                userWithMealPreference.map((data, index) => (
                  <tr key={index}>
                    <td align="center">
                      <Checkbox onClick={() => {}} />
                    </td>
                    <td>{<UserAvatar user={userIdMap[data.user]} />}</td>
                    <td>{userIdMap[data.user]?.room || 'N/A'}</td>
                    <td>
                      <MealTypeBadge
                        key={data.mealType}
                        value={data.mealType}
                      />
                    </td>
                    {/* <td>
                      {data.items.length > 0 ? data.items.join(', ') : 'None'}
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Center color="dimmed" w={'100%'} h={'200px'}>
                      No students found. Meal Type: {menuType}
                    </Center>
                    {/* {children} */}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Section>
      </Card>
    </LoaderWrapper>
  );
};

export default MealChartView;

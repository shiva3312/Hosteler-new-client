//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Card, Text, Badge, Title, Flex, Divider, Box } from '@mantine/core';
import React from 'react';

import { MenuType } from '@/interfaces/enums';
import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { useMesses } from '@/lib/api/mess/mess/get-all-messes';
import { useOrganization } from '@/lib/api/organization/get-organization';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnit } from '@/lib/api/unit/get-unit';
import { useUsers } from '@/lib/api/user/get-users';

import { ChartUserList } from './chart/chart-user-list';

const MealChartDetails: React.FC<{
  mealChart: MealChartResponse;
  viewOnly?: boolean;
}> = ({ mealChart, viewOnly = false }) => {
  const {
    extraMealCount = 0,
    userWithMealPreference = [],
    createdAt,
    notes,
  } = mealChart || {};

  const { data: users, isLoading: userLoading } = useUsers({
    params: SearchQuery.userSearchQuery({
      usersId: userWithMealPreference.map((u) => u.user),
      unit: mealChart.unit ?? '',
      organization: mealChart.organization ?? '',
    }),
    customKey: `meal-chart-${mealChart._id}-users`,
    enabled: userWithMealPreference.length > 0,
  });

  const { data: organizations } = useOrganization({
    organization: mealChart.organization ?? '',
    enabled: !!mealChart.organization,
  });

  const { data: unit } = useUnit({
    unit: mealChart.unit ?? '',
    enabled: !!mealChart.unit,
  });

  const { data: messes } = useMesses({
    params: {
      unit: mealChart.unit ?? '',
      organization: mealChart.organization ?? '',
    },
    enabled: !!mealChart.unit && !!mealChart.organization,
  });

  const totalGuests = users?.data.filter((user) => user?.parent).length ?? 0;
  const totalUsers = users?.data.length ?? 0;

  //   const totalInactive = totalUsers ? totalUsers - totalGuests : 0;
  const organizationName = organizations?.data.name ?? 'NA';
  const unitName = unit?.data.name ?? 'NA';
  const createdAtFormatted = createdAt
    ? new Date(createdAt).toString().slice(0, 25)
    : 'N/A';

  const mess = messes?.data[0];
  const messName = mess?.name ?? 'N/A';

  const serveTimeObj =
    mealChart.menuType === MenuType.Breakfast
      ? mess?.breakFastTime
      : mealChart.menuType === MenuType.Lunch
        ? mess?.lunchTime
        : mealChart.menuType === MenuType.Dinner
          ? mess?.dinnerTime
          : mess?.snackTime;

  const serveTime = `${serveTimeObj?.startTime ?? 'N/A'} - ${serveTimeObj?.endTime ?? 'N/A'}`;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* Header */}
      <Flex direction={'column'} justify={'center'} align={'center'} mb="lg">
        <Title order={3} mb={'xs'}>
          {messName}
        </Title>
        <Text size="xs" color="dimmed">
          {unitName}
        </Text>
        <Text size="xs" color="dimmed">
          {organizationName}
        </Text>
      </Flex>
      <Flex direction={'row-reverse'}>
        <Badge tt={'capitalize'} variant="white" c={'black'}>
          {createdAtFormatted}
        </Badge>
      </Flex>
      <Divider my={'md'} />
      {notes && (
        <Box>
          <Text size="sm">
            <Text fw={'bold'}>Note:</Text>
            <Text>{notes}</Text>
          </Text>
        </Box>
      )}

      <Divider variant="dashed" my={'md'} />

      {/* Summary */}
      <Flex justify={'space-between'} align={'center'} px={'md'}>
        <Box>
          <Text size="sm" fw={500} m={'xs'}>
            Total Active: {totalUsers}
          </Text>

          <Text size="sm" fw={500} m={'xs'}>
            Total Guest: {totalGuests}
          </Text>

          <Text size="sm" fw={500} m={'xs'}>
            Extra Meal: {extraMealCount}
          </Text>

          {/* <Text size="sm" fw={500} m={'xs'}>
            Total InActive: {totalGuests}
          </Text> */}
        </Box>

        <Box>
          <Text size="sm" fw={500} m={'xs'}>
            Menu Type: {mealChart.menuType}
          </Text>
          <Text size="sm" fw={500} m={'xs'}>
            Serve Time: {serveTime}
          </Text>
        </Box>
      </Flex>

      {/* User List */}
      <Divider variant="solid" my={'md'} />

      <Divider variant="dashed" my={'md'} />
      <ChartUserList
        viewOnly={viewOnly}
        mealChart={mealChart}
        users={users?.data}
        isLoading={userLoading}
      />
    </Card>
    // </LoaderWrapper>
  );
};

export default MealChartDetails;

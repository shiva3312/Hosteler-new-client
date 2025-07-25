//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Card, Text, Badge, Title, Flex, Divider, Box } from '@mantine/core';
import React from 'react';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { MenuType } from '@/interfaces/enums';
import { CreateToViewMealChart } from '@/interfaces/mess/meal-chart.interface';
import { useMealChartsToView } from '@/lib/api/mess/meal-chart/create-to-view-meal-chart';
import { useMesses } from '@/lib/api/mess/mess/get-all-messes';
import { useOrganization } from '@/lib/api/organization/get-organization';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnit } from '@/lib/api/unit/get-unit';
import { useUsers } from '@/lib/api/user/get-users';

import { ChartUserList } from './chart/chart-user-list';

const MealChartDetails: React.FC<CreateToViewMealChart> = ({
  mealChartType,
  menuType,
  ...props
}: CreateToViewMealChart) => {
  const { data: mealChart, isLoading } = useMealChartsToView({
    params: {
      unit: props.unit,
      organization: props.organization,
      menuType,
      mealChartType,
    },
    enabled: !!props.unit && !!props.organization,
  });

  const {
    extraMealCount = 0,
    userWithMealPreference = [],
    createdAt,
    notes,
  } = mealChart?.data || {};

  const { data: users, isLoading: userLoading } = useUsers({
    params: SearchQuery.userSearchQuery({
      usersId: userWithMealPreference.map((u) => u.user),
    }),
  });

  const { data: organizations } = useOrganization({
    organization: props.organization,
    enabled: !!props.organization,
  });

  const { data: unit } = useUnit({
    unit: props.unit,
    enabled: !!props.unit,
  });

  const { data: messes } = useMesses({
    params: { unit: props.unit, organization: props.organization },
    enabled: !!props.unit && !!props.organization,
  });

  const totalGuests = users?.data.filter((user) => user?.parent).length;
  const totalUsers = users?.data.length;

  //   const totalInactive = totalUsers ? totalUsers - totalGuests : 0;
  const organizationName = organizations?.data.name ?? 'NA';
  const unitName = unit?.data.name ?? 'NA';
  const createdAtFormatted = createdAt
    ? new Date(createdAt).toString().slice(0, 25)
    : 'N/A';

  const mess = messes?.data[0];
  const messName = mess?.name ?? 'N/A';

  const serveTimeObj =
    menuType === MenuType.Breakfast
      ? mess?.breakFastTime
      : menuType === MenuType.Lunch
        ? mess?.lunchTime
        : menuType === MenuType.Dinner
          ? mess?.dinnerTime
          : mess?.snackTime;

  const serveTime = `${serveTimeObj?.startTime} - ${serveTimeObj?.endTime}`;

  return (
    <LoaderWrapper
      isLoading={isLoading}
      loadingText="Hold a minute, Getting you meal chart..."
    >
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
        {/* Menu */}
        {/* {menu && (
          <Box>
            <Box>Todays menu</Box>
            <Divider variant="dashed" my={'md'} />
          </Box>
        )} */}

        {/* Category */}
        {/* {category && (
          <Box>
            <Box>Category</Box>
            <Divider variant="dashed" my={'md'} />
          </Box>
        )} */}

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
              Menu Type: {menuType}
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
          userWithMealPreference={userWithMealPreference}
          users={users?.data}
          isLoading={userLoading}
        />
      </Card>
    </LoaderWrapper>
  );
};

export default MealChartDetails;

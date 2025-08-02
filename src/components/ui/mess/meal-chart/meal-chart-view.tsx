//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Card,
  Text,
  Badge,
  Title,
  Flex,
  Divider,
  Box,
  Table,
} from '@mantine/core';
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

  // group student by mealType
  const groupUsersByMealType = (
    userWithMealPreference: Array<{
      mealType?: string | null;
      [key: string]: any;
    }>,
  ) => {
    return userWithMealPreference.reduce(
      (acc, user) => {
        const mealType = user.mealType ? String(user.mealType) : 'Unknown'; // Always convert to string
        if (!acc[mealType]) {
          acc[mealType] = [];
        }
        acc[mealType].push(user);
        return acc;
      },
      {} as Record<
        string,
        Array<{ mealType?: string | null; [key: string]: any }>
      >,
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* Header */}
      {viewOnly && (
        <Flex>
          <Badge tt={'capitalize'} variant="white" c={'violet'}>
            Live chart
          </Badge>
        </Flex>
      )}
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
      <Flex
        justify={'space-between'}
        align={'center'}
        px={'md'}
        wrap={'wrap'}
        gap={'md'}
      >
        <Box>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User Type</Table.Th>
                <Table.Th>Count</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Regular</Table.Td>
                <Table.Td>{totalUsers - totalGuests}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Guest</Table.Td>
                <Table.Td>{totalGuests}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Total Active</Table.Td>
                <Table.Td>{totalUsers}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
        <Box>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Category Type</Table.Th>
                <Table.Th>Count</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                {Object.keys(groupUsersByMealType(userWithMealPreference)).map(
                  (mealType) => (
                    <>
                      <Table.Td>{mealType}</Table.Td>
                      <Table.Td>
                        {
                          groupUsersByMealType(userWithMealPreference)[mealType]
                            .length
                        }
                      </Table.Td>
                    </>
                  ),
                )}
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
        <Box>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th colSpan={2}>Other Information</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Menu Type</Table.Td>
                <Table.Td>{mealChart.menuType}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Serve Time</Table.Td>
                <Table.Td> {serveTime}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Extra Meal</Table.Td>
                <Table.Td>{extraMealCount}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
      </Flex>

      {/* User List */}
      <Divider variant="dashed" my={'md'} />

      <Text c="blue">Total meal - {totalUsers + extraMealCount}</Text>

      <Divider variant="solid" my={'md'} />
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

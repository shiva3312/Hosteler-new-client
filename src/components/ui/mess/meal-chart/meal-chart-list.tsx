//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Button, Box } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { UserRole } from '@/data/feature';
import { useScreenType } from '@/hooks/use-scree-type';
import { ScreenType } from '@/interfaces/enums';
import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';
import { useMealCharts } from '@lib/api/mess/meal-chart/get-all-meal-charts';

import { DeleteMealChart } from './meal-chart-delete';
import { MealChartForm } from './meal-chart-form';
import EnumBadge from '../../core/badge/generic-badge';

export const MealChartsList = () => {
  const mealChartsQuery = useMealCharts();
  const { screenType } = useScreenType();

  const { data: me } = useMe();

  const isNonAdmin = AuthorizationService.hasLowerRole(
    me?.data?.roles ?? [],
    UserRole.ADMIN,
  );

  const columns = useMemo<MRT_ColumnDef<MealChartResponse>[]>(
    () => [
      {
        accessorFn: (row) => new Date(row.createdAt).getTime(),
        accessorKey: 'preparedAt',
        header: 'Prepared At',
        id: 'preparedAt',
        Cell: ({ row }) => (
          <DateBadge
            variant="transparent"
            date={row.original.createdAt}
            time={true}
          />
        ),
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.userWithMealPreference?.length,
        accessorKey: 'userWithMealPreference',
        header: 'Active Users',
        id: 'userWithMealPreference',
        Cell: ({ row }) => row.original.userWithMealPreference?.length,
        enableEditing: false,
      },
      {
        accessorFn: (row) =>
          `${row.serveTime?.startTime} - ${row.serveTime?.endTime}`,
        accessorKey: 'serveTime',
        header: 'Serve Time',
        id: 'serveTime',
        Cell: ({ row }) =>
          `${row.original.serveTime.startTime} - ${row.original.serveTime.endTime}`,
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.menu,
        accessorKey: 'menu',
        header: 'Menu',
        id: 'menu',
        Cell: ({ row }) => row.original.menu || 'No Menu',
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.menuCycle,
        accessorKey: 'menuCycle',
        header: 'Menu Cycle',
        id: 'menuCycle',
        Cell: ({ row }) => row.original.menuCycle || 'No Menu Cycle',
        enableEditing: false,
      },

      {
        accessorFn: (row) => row.extraMealCount,
        accessorKey: 'extraMealCount',
        header: 'Extra Meal Count',
        id: 'extraMealCount',
        Cell: ({ row }) => row.original.extraMealCount || 0,
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.menuType,
        accessorKey: 'menuType',
        header: 'Menu Type',
        id: 'menuType',
        Cell: ({ row }) => <EnumBadge value={row.original.menuType} />,
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.type,
        accessorKey: 'type',
        header: 'Type',
        id: 'type',
        Cell: ({ row }) => <EnumBadge value={row.original.type} />,
        enableEditing: false,
      },
      {
        accessorFn: (row) => new Date(row.updatedAt).getTime(),
        accessorKey: 'updatedAt',
        header: 'Last updated',
        id: 'updatedAt',
        Cell: ({ row }) => (
          <DateBadge
            variant="transparent"
            date={row.original.updatedAt}
            time={true}
          />
        ),
        enableEditing: false,
      },
      {
        accessorFn: (row) => new Date(row.createdAt).getTime(),
        accessorKey: 'createdAt',
        header: 'Created',
        id: 'createdAt',
        Cell: ({ row }) => (
          <DateBadge
            variant="transparent"
            date={row.original.createdAt}
            time={true}
          />
        ),
        enableEditing: false,
      },
    ],
    [],
  );

  const options: MRT_TableOptions<MealChartResponse> = useMemo(
    () => ({
      columns,
      data: mealChartsQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: mealChartsQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMealChart,
      renderRowActions: ({ row }) => {
        // return isNonAdmin ? undefined : (
        return (
          <Flex gap="md">
            {/* <Tooltip label="Edit">
              <ActionIcon
                color="blue"
                onClick={() => {
                  table.setEditingRow(row);
                }}
              >
                <GenericDrawer title="Update" trigger={<IconEdit size={25} />}>
                  <MealChartForm initialValues={row.original!} />
                </GenericDrawer>
              </ActionIcon>
            </Tooltip> */}
            <ActionIcon
              color="blue"
              onClick={() => {
                modals.open({
                  title: `${row.original.menuType} - Meal Chart`,
                  children: (
                    <Box mt={'lg'}>
                      <MealChartForm initialValues={row.original!} />
                    </Box>
                  ),
                  size: '80%',
                  fullScreen: screenType === ScreenType.Small,
                });
              }}
            >
              <IconInfoCircle size={25} />
            </ActionIcon>
            {!isNonAdmin && (
              <Tooltip label="Delete">
                <ActionIcon color="red">
                  <DeleteMealChart mealChart={row.original} />
                </ActionIcon>
              </Tooltip>
            )}
          </Flex>
        );
        // );
      },

      renderTopToolbarCustomActions: () => {
        return (
          <Button
            onClick={() => {
              modals.open({
                title: 'Meal Chart',
                children: (
                  <Box mt={'lg'}>
                    <MealChartForm viewOnly />
                  </Box>
                ),
                size: '80%',
                fullScreen: screenType === ScreenType.Small,
              });
            }}
          >
            View Live Chart
          </Button>
        );
      },
    }),
    [columns, isNonAdmin, mealChartsQuery.data?.data, screenType],
  );

  const state: Partial<MRT_TableState<MealChartResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: mealChartsQuery.isLoading,
    }),
    [mealChartsQuery.isLoading],
  );

  return (
    <GenericTable
      data={mealChartsQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

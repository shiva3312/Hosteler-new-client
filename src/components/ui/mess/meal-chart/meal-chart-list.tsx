//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Button, Box } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit } from '@tabler/icons-react';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { useScreenType } from '@/hooks/use-scree-type';
import { ScreenType } from '@/interfaces/enums';
import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { useMealCharts } from '@lib/api/mess/meal-chart/get-all-meal-charts';

import { DeleteMealChart } from './meal-chart-delete';
import { MealChartForm } from './meal-chart-form';
import { GenericDrawer } from '../../core/drawer/drawer';

export const MealChartsList = () => {
  const mealChartsQuery = useMealCharts();
  const { screenType } = useScreenType();

  const columns = useMemo<MRT_ColumnDef<MealChartResponse>[]>(
    () => [
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
      renderRowActions: ({ row, table }) => (
        <Flex gap="md">
          <Tooltip label="Edit">
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
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteMealChart mealChart={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <Button
            onClick={() => {
              modals.open({
                title: 'Meal Chart',
                children: (
                  <Box mt={'lg'}>
                    <MealChartForm />,
                  </Box>
                ),
                size: 'xl',
                fullScreen: screenType === ScreenType.Small,
              });
            }}
          >
            View Chart
          </Button>
        );
      },
    }),
    [columns, mealChartsQuery.data?.data, screenType],
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

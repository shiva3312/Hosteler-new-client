//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Button } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { MealItemResponse } from '@/interfaces/mess/meal-item.interface';
import { useMealItems } from '@lib/api/mess/meal-item/get-all-meal-items';

import { DeleteMealItem } from './meal-item-delete';
import { MealItemForm } from './meal-item-form';
import MealItemProfileImage from './meal-item-view';
import { GenericDrawer } from '../../core/drawer/drawer';

export const MealItemsList = () => {
  const mealItemsQuery = useMealItems();

  const columns = useMemo<MRT_ColumnDef<MealItemResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        // Footer: () => {
        //   return (
        //     <>{`${mealItemsQuery.data?.data.length ?? 0} MealItems.`}</>
        //   );
        // },
        Cell: ({ row }) => <MealItemProfileImage mealItem={row.original} />,
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
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

  const options: MRT_TableOptions<MealItemResponse> = useMemo(
    () => ({
      columns,
      data: mealItemsQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: mealItemsQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMealItem,
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
                <MealItemForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteMealItem mealItem={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer title="Update" trigger={<Button>Add New</Button>}>
            <MealItemForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, mealItemsQuery.data?.data],
  );

  const state: Partial<MRT_TableState<MealItemResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: mealItemsQuery.isLoading,
    }),
    [mealItemsQuery.isLoading],
  );

  return (
    <GenericTable
      data={mealItemsQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Button, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { UserRole } from '@/data/feature';
import { MealItemResponse } from '@/interfaces/mess/meal-item.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMe } from '@/lib/api/user/get-me';
import { useMealItems } from '@lib/api/mess/meal-item/get-all-meal-items';

import { DeleteMealItem } from './meal-item-delete';
import { MealItemForm } from './meal-item-form';
import MealItemProfileImage from './meal-item-view';
import MealTypeBadge from '../../core/badge/meal-type';
import { GenericDrawer } from '../../core/drawer/drawer';

export const MealItemsList = () => {
  const { data: mealItem, isSuccess, isLoading } = useMealItems();

  const { data: organizations } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
    enabled: isSuccess && mealItem?.data.length > 0,
  });

  const { data: me } = useMe();

  const { data: units } = useUnits({
    params: SearchQuery.unitSearchQuery({}),
    enabled: isSuccess && mealItem?.data.length > 0,
  });

  const isNonAdmin = AuthorizationService.hasLowerRole(
    me?.data?.roles ?? [],
    UserRole.ADMIN,
  );

  const columns = useMemo<MRT_ColumnDef<MealItemResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        Cell: ({ row }) => <MealItemProfileImage mealItem={row.original} />,
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.mealType,
        accessorKey: 'mealType',
        header: 'Meal Type',
        id: 'mealType',
        size: 250,
        Cell: ({ row }) => (
          <MealTypeBadge key={row.original._id} value={row.original.mealType} />
        ),
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.unit,
        accessorKey: 'unit',
        header: 'Unit',
        id: 'unit',
        Cell: ({ row }) => {
          // const unit = row.original.unit;
          return (
            <Text>
              {units?.data?.find((u) => u._id === row.original.unit)?.name ??
                'N/A'}
            </Text>
          );
        },
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.organization,
        accessorKey: 'organization',
        header: 'Organization',
        id: 'organization',
        Cell: ({ row }) => {
          return (
            <Text>
              {organizations?.data?.find(
                (org) => org._id === row.original.organization,
              )?.name ?? 'N/A'}
            </Text>
          );
        },
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
    [organizations?.data, units?.data],
  );

  const options: MRT_TableOptions<MealItemResponse> = useMemo(
    () => ({
      columns,
      data: mealItem?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: mealItem?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMealItem,
      renderRowActions: ({ row, table }) =>
        isNonAdmin ? undefined : (
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
        if (isNonAdmin) return undefined;
        return (
          <GenericDrawer title="Update" trigger={<Button>Add New</Button>}>
            <MealItemForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, isNonAdmin, mealItem?.data],
  );

  const state: Partial<MRT_TableState<MealItemResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading,
    }),
    [isLoading],
  );

  return (
    <GenericTable
      data={mealItem?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

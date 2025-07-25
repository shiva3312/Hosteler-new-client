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
import { MealPreferenceResponse } from '@/interfaces/mess/meal-preference.interface';
import { SearchQuery } from '@/lib/api/search-query';
import { useMealPreferences } from '@lib/api/mess/meal-preference/get-all-meal-preferences';

import { DeleteMealPreference } from './meal-preference-delete';
import { MealPreferenceForm } from './meal-preference-form';
import { MenuTypeBadge, MealTypeBadge } from '../../core/badge/enum-badage';
import { GenericDrawer } from '../../core/drawer/drawer';
import UserAvatar from '../../user/user-list-avatar';

export const MealPreferencesList = () => {
  const mealPreferencesQuery = useMealPreferences({
    params: SearchQuery.mealPreferenceSearchQuery(),
  });

  const columns = useMemo<MRT_ColumnDef<MealPreferenceResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.user,
        accessorKey: 'username',
        header: 'Username',
        id: 'username',
        size: 250,
        // Footer: () => {
        //   return <>{`${users?.data.length ?? 0} Users.`}</>;
        // },
        Cell: ({ row }) => <UserAvatar user={row.original?.user ?? ''} />,
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
        Cell: ({ row }) => (
          <MealTypeBadge
            value={row.original.mealType}
            key={row.original.mealType}
          />
        ),
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.menuType,
        accessorKey: 'menuType',
        header: 'Menu',
        id: 'menuType',
        Cell: ({ row }) => (
          <MenuTypeBadge
            value={row.original.menuType}
            key={row.original.menuType}
          />
        ),
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

  const options: MRT_TableOptions<MealPreferenceResponse> = useMemo(
    () => ({
      columns,
      data: mealPreferencesQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: mealPreferencesQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMealPreference,
      renderRowActions: ({ row, table }) => (
        <Flex gap="md">
          <Tooltip label="Edit">
            <ActionIcon
              color="blue"
              onClick={() => {
                table.setEditingRow(row);
              }}
            >
              <GenericDrawer
                title="Update Preference"
                trigger={<IconEdit size={25} />}
              >
                <MealPreferenceForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteMealPreference mealPreference={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer
            title="Create Preference"
            trigger={<Button>Add New</Button>}
          >
            <MealPreferenceForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, mealPreferencesQuery.data?.data],
  );

  const state: Partial<MRT_TableState<MealPreferenceResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: mealPreferencesQuery.isLoading,
    }),
    [mealPreferencesQuery.isLoading],
  );

  return (
    <GenericTable
      data={mealPreferencesQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

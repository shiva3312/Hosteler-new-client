//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Badge, Group, Text } from '@mantine/core';
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo, useRef } from 'react';

import MealTypeBadge from '@/components/ui/core/badge/meal-type';
import GenericTable from '@/components/ui/core/table/GenericTable';
import UserAvatar from '@/components/ui/user/user-list-avatar';
import { UserRole } from '@/data/feature';
import { MealType } from '@/interfaces/enums';
import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { UserResponse } from '@/interfaces/user.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';

import { MealChartUserBulkActions } from './chart-user-bulk-action';

interface ChartUserListProps {
  users?: UserResponse[];
  isLoading?: boolean;
  mealChart: MealChartResponse;
  viewOnly?: boolean;
}

export const ChartUserList = ({
  viewOnly = false,
  users = [],
  isLoading = false,
  mealChart,
}: ChartUserListProps) => {
  const { data: me } = useMe();
  const tableRef = useRef<MRT_TableInstance<UserResponse>>(null);

  const userIdPreferenceMap = useMemo(() => {
    const userWithMealPreference = mealChart.userWithMealPreference ?? [];
    return userWithMealPreference.reduce<
      Record<string, (typeof userWithMealPreference)[number]>
    >((acc, preference) => {
      acc[preference.user] = preference;
      return acc;
    }, {});
  }, [mealChart.userWithMealPreference]);

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.username,
        accessorKey: 'username',
        header: 'Username',
        id: 'username',
        maxSize: 300,
        Cell: ({ row }) => (
          <UserAvatar user={row.original} /> // Ensure the user prop matches the updated interface
        ),
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) =>
          `${row.profile?.firstName ?? ''} ${row.profile?.lastName ?? ''}`,
        accessorKey: 'profile.fullName',
        header: 'Full Name',
        id: 'profile.fullName',
        maxSize: 200,
        Cell: ({ row }) => (
          <Text>
            {`${row.original.profile?.firstName ?? ''} ${row.original.profile?.lastName ?? ''}`.trim()}
          </Text>
        ),
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => userIdPreferenceMap[row._id]?.verify,
        accessorKey: 'verify',
        header: 'Taken',
        size: 80,
        id: 'verify',
        Cell: ({ row }) => (
          <Badge
            variant="light"
            color={
              userIdPreferenceMap[row.original._id]?.verify ? 'green' : 'red'
            }
          >
            {userIdPreferenceMap[row.original._id]?.verify ? 'Yes' : 'No'}
          </Badge>
        ),
      },
      {
        accessorFn: (row) => row.room,
        accessorKey: 'room',
        header: 'Room',
        size: 80,
        id: 'room',
      },
      {
        accessorFn: (row) => row.profile?.contacts?.phone,
        accessorKey: 'profile.contacts.phone',
        header: 'phone',
        id: 'profile.contacts.phone',
        Cell: ({ row }) => <Text>{row.original.profile?.contacts?.phone}</Text>,
        enableEditing: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => userIdPreferenceMap[row._id]?.mealType ?? null,
        accessorKey: 'Preferences.mealType',
        header: 'Preferences',
        id: 'Preferences',
        Cell: ({ row }) => (
          <MealTypeBadge
            value={
              userIdPreferenceMap[row.original._id]?.mealType ??
              (row.original.profile?.preferences?.mealType as MealType)
            }
          />
        ),
        enableEditing: true,
        enableColumnFilter: true,
      },
    ],
    [userIdPreferenceMap],
  );

  const options: MRT_TableOptions<UserResponse> = useMemo(
    () => ({
      columns,
      data: users ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: users?.length ?? 0,
      enableRowSelection:
        !viewOnly &&
        AuthorizationService.hasEqualOrHigherRole(
          me?.data?.roles ?? [],
          UserRole.ADMIN,
        ),
      enableRowActions: false,
      enableEditing: false,
      enableColumnFilters: false,
      enableColumnActions: false,
      mantineTableProps: {
        withColumnBorders: false,
        // withRowBorders: false,
        withTableBorder: false,
        frameBorder: 'none',
        tabularNums: true,
      },
      enablePinning: false,
      enableDensityToggle: false,
      enableHiding: false,
      enableColumnPinning: false,
      enableGlobalFilter: true,
      positionToolbarAlertBanner: 'none',

      renderRowActionMenuItems: undefined,

      renderTopToolbarCustomActions: () => {
        if (viewOnly) return null;

        return (
          <Group>
            {AuthorizationService.hasEqualOrHigherRole(
              me?.data.roles ?? [],
              UserRole.ADMIN,
            ) && (
              <MealChartUserBulkActions
                onSuccess={() => {
                  tableRef.current?.resetRowSelection();
                }}
                selectedRows={
                  tableRef.current
                    ?.getSelectedRowModel()
                    .flatRows.map((row) => row.original) ?? []
                }
                mealChart={mealChart}
              />
            )}
          </Group>
        );
      },
    }),

    [columns, me?.data.roles, mealChart, users, viewOnly],
  );

  const state: Partial<MRT_TableState<UserResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
      },
      density: 'xs',
      isLoading,
    }),
    [isLoading],
  );

  return (
    <GenericTable
      data={users ?? []}
      columns={columns}
      options={options}
      state={state}
      setTable={(table) => {
        (tableRef as any).current = table;
      }}
    />
  );
};

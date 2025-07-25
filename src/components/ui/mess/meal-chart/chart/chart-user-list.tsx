//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Badge, Text } from '@mantine/core';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo } from 'react';

import MealTypeBadge from '@/components/ui/core/badge/meal-type';
import GenericTable from '@/components/ui/core/table/GenericTable';
import UserAvatar from '@/components/ui/user/user-list-avatar';
import { UserRole } from '@/data/feature';
import { MealType } from '@/interfaces/enums';
import { UserResponse } from '@/interfaces/user.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';

interface ChartUserListProps {
  users?: UserResponse[];
  isLoading?: boolean;
  userWithMealPreference: {
    user: string;
    verify: boolean;
    items: string[];
    mealType?: MealType | null | undefined;
  }[];
}

export const ChartUserList = ({
  users = [],
  isLoading = false,
  userWithMealPreference,
}: ChartUserListProps) => {
  const { data: me } = useMe();

  const userIdPreferenceMap: Record<
    string,
    ChartUserListProps['userWithMealPreference'][number]
  > = useMemo(() => {
    return userWithMealPreference.reduce(
      (acc, preference) => {
        acc[preference.user] = preference;
        return acc;
      },
      {} as Record<
        string,
        ChartUserListProps['userWithMealPreference'][number]
      >,
    );
  }, [userWithMealPreference]);

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
        accessorKey: 'present',
        header: 'Present',
        size: 80,
        id: 'Present',
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
      enableRowSelection: AuthorizationService.hasEqualOrHigherRole(
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

      renderRowActionMenuItems: undefined,
    }),

    [columns, me?.data?.roles, users],
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
    />
  );
};

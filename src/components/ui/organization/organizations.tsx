//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Text } from '@mantine/core';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import RoleBadge from '@/components/ui/core/badge/role-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { UserResponse } from '@/interfaces/user.interface';

import { DeleteUser } from './organization-delete';
import UserFormDrawer from './organization-create';
import UserProfileImage from './organization-view';
import { useUsers } from '../../../lib/api/user/get-users';

export const UsersList = () => {
  const usersQuery = useUsers();

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.username,
        accessorKey: 'username',
        header: 'Username',
        id: 'username',
        size: 250,
        Footer: () => {
          return <>{`${usersQuery.data?.data.length ?? 0} Users.`}</>;
        },
        Cell: ({ row }) => <UserProfileImage user={row.original} />,
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.roles,
        accessorKey: 'roles',
        header: 'Roles',
        id: 'roles',
        Cell: ({ row }) => (
          <Flex gap="xs" align="center">
            {row.original.roles?.map((role) => (
              <RoleBadge key={role} variant="transparent" role={role} />
            ))}
          </Flex>
        ),
        enableEditing: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => row.profile?.gender,
        accessorKey: 'profile.gender',
        header: 'Gender',
        id: 'profile.gender',
        Cell: ({ row }) => <Text>{row.original.profile?.gender}</Text>,
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.profile?.contacts?.email,
        accessorKey: 'profile.contacts.email',
        header: 'Email',
        id: 'profile.contacts.email',
        Cell: ({ row }) => <Text>{row.original.profile?.contacts?.email}</Text>,
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
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
    [usersQuery.data?.data],
  );

  const options: MRT_TableOptions<UserResponse> = useMemo(
    () => ({
      columns,
      data: usersQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: usersQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveUser,
      renderRowActions: ({ row, table }) => (
        <Flex gap="md">
          <Tooltip label="Edit">
            <ActionIcon
              color="blue"
              onClick={() => {
                table.setEditingRow(row);
              }}
            >
              <UserFormDrawer initialValues={row.original!} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteUser user={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return <UserFormDrawer />;
      },
    }),
    [columns, usersQuery.data?.data],
  );

  const state: Partial<MRT_TableState<UserResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: usersQuery.isLoading,
    }),
    [usersQuery.isLoading],
  );

  return (
    <GenericTable
      data={usersQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

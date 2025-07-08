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
import { useGroups } from '@/lib/api/group/get-all-groups';
import { SearchQuery } from '@/lib/api/search-query';
import { useUsers } from '@/lib/api/user/get-users';

import { DeleteUser } from './delete-user';
import UserFormDrawer from './user-form';
import UserProfileImage from './user-image';

export const UsersList = () => {
  const {
    data: users,
    isSuccess,
    isLoading,
  } = useUsers({
    params: SearchQuery.userSearchQuery({}),
  });
  const { data: groups } = useGroups({
    params: SearchQuery.groupSearchQuery({}),
    enabled: isSuccess && users?.data.length > 0,
  });

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.username,
        accessorKey: 'username',
        header: 'Username',
        id: 'username',
        size: 250,
        Footer: () => {
          return <>{`${users?.data.length ?? 0} Users.`}</>;
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
        // size: 250,
        Cell: ({ row }) => (
          <Flex gap="xs" wrap={'wrap'}>
            {row.original.roles?.map((role) => (
              <RoleBadge key={role} variant="light" role={role} />
            ))}
          </Flex>
        ),
        enableSorting: false,
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
        accessorFn: (row) => row.group,
        accessorKey: 'group',
        header: 'Group',
        id: 'group',
        Cell: ({ row }) => {
          const group = groups?.data?.find((g) => g._id === row.original.group);
          return <Text>{group?.name ?? ''}</Text>;
        },
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
    [groups?.data, users?.data.length],
  );

  const options: MRT_TableOptions<UserResponse> = useMemo(
    () => ({
      columns,
      data: users?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: users?.data?.length ?? 0,
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
    [columns, users?.data],
  );

  const state: Partial<MRT_TableState<UserResponse>> = useMemo(
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
      data={users?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

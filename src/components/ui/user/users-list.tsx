//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Text, Button } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
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
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useGroups } from '@/lib/api/group/get-all-groups';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMe } from '@/lib/api/user/get-me';
import { useUsers } from '@/lib/api/user/get-users';

import { DeleteUser } from './delete-user';
import { UserForm } from './user-form';
import UserProfileImage from './user-list-avatar';
import EnumBadge from '../core/badge/generic-badge';
import { GenericDrawer } from '../core/drawer/drawer';

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

  const { data: organizations } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
    enabled: isSuccess && users?.data.length > 0,
  });

  const { data: units } = useUnits({
    params: SearchQuery.unitSearchQuery({}),
    enabled: isSuccess && users?.data.length > 0,
  });

  const { data: me } = useMe();
  const isNoneAdminRoles = useMemo(() => {
    return AuthorizationService.isNoneAdminRoles(me?.data?.roles ?? []);
  }, [me?.data?.roles]);

  const columns = useMemo<MRT_ColumnDef<UserResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.username,
        accessorKey: 'username',
        header: 'Username',
        id: 'username',
        size: 250,
        // Footer: () => {
        //   return <>{`${users?.data.length ?? 0} Users.`}</>;
        // },
        Cell: ({ row }) => <UserProfileImage user={row.original} />,
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
        size: 250,
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
        // accessorFn: (row) =>
        //   `${row.profile?.firstName ?? ''} ${row.profile?.lastName ?? ''}`,
        accessorKey: 'parent',
        header: 'Parent',
        id: 'parent',
        size: 250,
        Cell: ({ row }) => {
          const parent = users?.data?.find(
            (u) => u._id === row.original.parent,
          );
          return <Text>{parent?.username}</Text>;
        },
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
        Cell: ({ row }) => <EnumBadge value={row.original.profile?.gender} />,
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
    [groups?.data, organizations?.data, units?.data, users?.data],
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
              <GenericDrawer title="Update" trigger={<IconEdit size={25} />}>
                <UserForm initialValues={row.original!} />
              </GenericDrawer>
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
        return (
          <GenericDrawer
            title={isNoneAdminRoles ? `Create Guest` : `Create User`}
            trigger={
              <Button>{isNoneAdminRoles ? `Add Guest` : `Add New`}</Button>
            }
          >
            <UserForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, isNoneAdminRoles, users?.data],
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

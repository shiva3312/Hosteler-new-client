//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import {
  Flex,
  Tooltip,
  ActionIcon,
  Text,
  Button,
  Badge,
  Group,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo, useRef } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import RoleBadge from '@/components/ui/core/badge/role-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { UserRole } from '@/data/feature';
import { UserResponse } from '@/interfaces/user.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useGroups } from '@/lib/api/group/get-all-groups';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMe } from '@/lib/api/user/get-me';
import { useUsers } from '@/lib/api/user/get-users';

import { DeleteUser } from './delete-user';
import { BulkActions } from './user-bulk-action';
import { UserForm } from './user-form';
import UserProfileImage from './user-list-avatar';
import { MealStatusBadge, MealTypeBadge } from '../core/badge/enum-badage';
import EnumBadge from '../core/badge/generic-badge';
import { GenericDrawer } from '../core/drawer/drawer';

export const UsersList = () => {
  const tableRef = useRef<MRT_TableInstance<UserResponse>>(null);
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
        // size: 250,
        maxSize: 300,
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
        size: 200,
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
        accessorFn: (row) => row.isVerified,
        accessorKey: 'isVerified',
        header: 'Verified',
        size: 80,
        id: 'isVerified',
        Cell: ({ row }) => (
          <Badge
            tt={'capitalize'}
            color={row.original.isVerified ? 'green' : 'red'}
            variant="light"
          >
            {row.original.isVerified ? 'Yes' : 'No'}
          </Badge>
        ),
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.room,
        accessorKey: 'room',
        header: 'Room',
        size: 80,
        id: 'room',
      },
      {
        accessorFn: (row) => row.status,
        accessorKey: 'status',
        header: 'Status',
        size: 80,
        id: 'status',
        Cell: ({ row }) => (
          <Flex gap="xs" wrap={'wrap'}>
            <MealStatusBadge
              key={row.original.status}
              value={row.original.status}
            />
          </Flex>
        ),
        enableSorting: false,
        enableEditing: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => row.profile?.preferences?.mealType,
        accessorKey: 'profile?.preferences?.MealType',
        header: 'Meal Type',
        size: 90,
        id: 'profile.preferences.MealType',
        Cell: ({ row }) => (
          <Flex gap="xs" wrap={'wrap'}>
            <MealTypeBadge
              key={row.original.profile?.preferences?.mealType}
              value={row.original.profile?.preferences?.mealType}
            />
          </Flex>
        ),
        enableSorting: false,
        enableEditing: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => row.mealStatus,
        accessorKey: 'mealStatus',
        header: 'Meal Status',
        id: 'mealStatus',
        size: 80,
        Cell: ({ row }) => (
          <Flex gap="xs" wrap={'wrap'}>
            <MealStatusBadge
              key={row.original.mealStatus}
              value={row.original.mealStatus}
            />
          </Flex>
        ),
        enableSorting: false,
        enableEditing: true,
        enableColumnFilter: true,
      },
      {
        accessorFn: (row) => row.roles,
        accessorKey: 'roles',
        header: 'Roles',
        id: 'roles',
        // size: 80,
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
        size: 80,
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
        size: 80,
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
        // accessorFn: (row) =>
        //   `${row.profile?.firstName ?? ''} ${row.profile?.lastName ?? ''}`,
        accessorKey: 'parent',
        header: 'Parent',
        id: 'parent',
        // size: 250,
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
      enableRowSelection: (row) => row.original._id !== me?.data._id,

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
          <Group>
            <GenericDrawer
              title={isNoneAdminRoles ? `Create Guest` : `Create User`}
              trigger={
                <Button>{isNoneAdminRoles ? `Add Guest` : `Add New`}</Button>
              }
            >
              <UserForm />
            </GenericDrawer>
            {AuthorizationService.hasEqualOrHigherRole(
              me?.data.roles ?? [],
              UserRole.ADMIN,
            ) && (
              <BulkActions
                onSuccess={() => {
                  tableRef.current?.resetRowSelection();
                }}
                selectedRows={
                  tableRef.current
                    ?.getSelectedRowModel()
                    .flatRows.map((row) => row.original) ?? []
                }
              />
            )}
          </Group>
        );
      },
    }),
    [columns, isNoneAdminRoles, me?.data._id, me?.data?.roles, users?.data],
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
      setTable={(table) => {
        (tableRef as any).current = table;
      }}
    />
  );
};

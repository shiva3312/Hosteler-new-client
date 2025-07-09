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
import { OrganizationResponse } from '@/interfaces/organization.interface';
import { SearchQuery } from '@/lib/api/search-query';
import { useUsers } from '@/lib/api/user/get-users';
import { useOrganizations } from '@lib/api/organization/get-all-organizations';

import { DeleteOrganization } from './organization-delete';
import { OrganizationForm } from './organization-form';
import OrganizationProfileImage from './organization-view';
import { GenericDrawer } from '../core/drawer/drawer';

export const OrganizationsList = () => {
  const { data: organizations, isLoading } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
  });

  const { data: users } = useUsers();

  const columns = useMemo<MRT_ColumnDef<OrganizationResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        Cell: ({ row }) => (
          <OrganizationProfileImage organization={row.original} />
        ),
        enableEditing: true,
        enableColumnFilter: true,
        mantineEditTextInputProps: {
          type: 'text',
        },
      },
      {
        accessorFn: (row) => row.superAdmin,
        accessorKey: 'superAdmin',
        header: 'Super Admin',
        id: 'superAdmin',
        size: 250,
        Cell: ({ row }) => {
          const user = users?.data.find(
            (user) => user._id === row.original.superAdmin,
          );
          return <Text>{user ? user.username : 'Not assigned'}</Text>;
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
    [],
  );

  const options: MRT_TableOptions<OrganizationResponse> = useMemo(
    () => ({
      columns,
      data: organizations?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: organizations?.data?.length ?? 0,
      editDisplayMode: 'custom',
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
                <OrganizationForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteOrganization organization={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer title="Update" trigger={<Button>Add New</Button>}>
            <OrganizationForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, organizations?.data],
  );

  const state: Partial<MRT_TableState<OrganizationResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: isLoading,
    }),
    [isLoading],
  );

  return (
    <GenericTable
      data={organizations?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

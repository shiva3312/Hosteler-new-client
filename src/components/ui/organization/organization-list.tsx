//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon } from '@mantine/core';
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
import { useOrganizations } from '@lib/api/organization/get-all-organizations';

import { DeleteOrganization } from './organization-delete';
import OrganizationFormDrawer from './organization-form';
import OrganizationProfileImage from './organization-view';

export const OrganizationsList = () => {
  const { data: organizations, isLoading } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
  });

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
              <OrganizationFormDrawer initialValues={row.original!} />
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
        return <OrganizationFormDrawer />;
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

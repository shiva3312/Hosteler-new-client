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
import { GroupResponse } from '@/interfaces/group.interface';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useGroups } from '@lib/api/group/get-all-groups';

import { DeleteGroup } from './group-delete';
import { GroupForm } from './group-form';
import GroupProfileImage from './group-view';
import { GenericDrawer } from '../core/drawer/drawer';

export const GroupsList = () => {
  const { data: groups, isLoading, isSuccess } = useGroups();
  const organizationQuery = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
    enabled: isSuccess,
  });

  const columns = useMemo<MRT_ColumnDef<GroupResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        Cell: ({ row }) => <GroupProfileImage group={row.original} />,
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
        size: 250,
        Cell: ({ row }) => {
          const organization = organizationQuery.data?.data.find(
            (org) => org._id === row.original.organization,
          );
          return organization ? organization.name : row.original.organization;
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

  const options: MRT_TableOptions<GroupResponse> = useMemo(
    () => ({
      columns,
      data: groups?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: groups?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveGroup,
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
                <GroupForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteGroup group={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer title="Update" trigger={<Button>Add New</Button>}>
            <GroupForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, groups?.data],
  );

  const state: Partial<MRT_TableState<GroupResponse>> = useMemo(
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
      data={groups?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

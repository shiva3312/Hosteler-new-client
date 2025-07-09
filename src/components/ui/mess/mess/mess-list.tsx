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
import { MessResponse } from '@/interfaces/mess/mess.interface';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMesses } from '@lib/api/mess/mess/get-all-messes';

import { DeleteMess } from './mess-delete';
import { MessForm } from './mess-form';
import MessProfileImage from './mess-view';
import { GenericDrawer } from '../../core/drawer/drawer';

export const MessesList = () => {
  const { data: messes, isSuccess, isLoading } = useMesses();

  const { data: organizations } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
    enabled: isSuccess && messes?.data.length > 0,
  });

  const { data: units } = useUnits({
    params: SearchQuery.unitSearchQuery({}),
    enabled: isSuccess && messes?.data.length > 0,
  });

  const columns = useMemo<MRT_ColumnDef<MessResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        Cell: ({ row }) => <MessProfileImage mess={row.original} />,
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
    [],
  );

  const options: MRT_TableOptions<MessResponse> = useMemo(
    () => ({
      columns,
      data: messes?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: messes?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMess,
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
                <MessForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteMess mess={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer title="Create User" trigger={<Button>Add New</Button>}>
            <MessForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, messes?.data],
  );

  const state: Partial<MRT_TableState<MessResponse>> = useMemo(
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
      data={messes?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

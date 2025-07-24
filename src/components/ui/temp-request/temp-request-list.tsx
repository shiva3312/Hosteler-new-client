//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Flex, Tooltip, ActionIcon, Button, Text, Code } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconEdit, IconLink } from '@tabler/icons-react';
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MRT_TableState,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';

import DateBadge from '@/components/ui/core/badge/date-badge';
import GenericTable from '@/components/ui/core/table/GenericTable';
import { TempRequestResponse } from '@/interfaces/temp-request.interface';
import { useTempRequests } from '@/lib/api/temp-request/get-all-temp-requests';

import { DeleteTempRequest } from './temp-request-delete';
import { TempRequestForm } from './temp-request-form';
import { GenericDrawer } from '../core/drawer/drawer';

export const TempRequestsList = () => {
  const tempRequestsQuery = useTempRequests({});
  const clipboard = useClipboard({ timeout: 1000 });
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    const now = new Date();
    const expirationDate = new Date(expiresAt);
    return expirationDate < now;
  };

  const columns = useMemo<MRT_ColumnDef<TempRequestResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        enableEditing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
          // write logic to generate a temp link
          const data = row.original?.data;
          const unitName = encodeURIComponent(data?.unit?.name?.trim() || '');
          const origin = window.location.origin;
          const tempLink = `${origin}/auth/register/new-user/${unitName}/${row.original.token}`;

          return (
            <Flex gap={'md'}>
              <Text>{String(row.getValue('name'))}</Text>

              {!isExpired(String(row.original.expiresAt)) && (
                <Button
                  variant="transparent"
                  onClick={() => {
                    clipboard.copy(tempLink);
                    setCopiedValue(tempLink);
                  }}
                >
                  <Tooltip label="Copy Link">
                    {clipboard.copied && copiedValue === tempLink ? (
                      <Code c="green">Copied</Code>
                    ) : (
                      <IconLink color="blue" size={16} />
                    )}
                  </Tooltip>
                </Button>
              )}
            </Flex>
          );
        },
      },
      {
        accessorFn: (row) => row.description,
        accessorKey: 'description',
        header: 'Description',
        id: 'description',
      },
      {
        accessorFn: (row) => new Date(row.expiresAt ?? '').getTime(),
        accessorKey: 'expiresAt',
        header: 'ExpiresAt',
        id: 'expiresAt',
        Cell: ({ row }) => {
          if (isExpired(String(row.original.expiresAt))) {
            return <Text color="red">Expired</Text>;
          }

          return (
            <DateBadge
              variant="transparent"
              date={row.original.expiresAt ?? ''}
              time={true}
            />
          );
        },
        enableEditing: false,
      },
      {
        accessorFn: (row) => new Date(row.updatedAt).getTime(),
        accessorKey: 'updatedAt',
        header: 'UpdatedAt',
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
    [clipboard, copiedValue],
  );

  const options: MRT_TableOptions<TempRequestResponse> = useMemo(
    () => ({
      columns,
      data: tempRequestsQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: tempRequestsQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveTempRequest,
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
                <TempRequestForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteTempRequest tempRequest={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer title="Update" trigger={<Button>Add New</Button>}>
            <TempRequestForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, tempRequestsQuery.data?.data],
  );

  const state: Partial<MRT_TableState<TempRequestResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: tempRequestsQuery.isLoading,
    }),
    [tempRequestsQuery.isLoading],
  );

  return (
    <GenericTable
      data={tempRequestsQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

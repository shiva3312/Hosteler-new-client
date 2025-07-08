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
import { MessResponse } from '@/interfaces/mess/mess.interface';
import { useMesses } from '@lib/api/mess/mess/get-all-messes';

import { DeleteMess } from './mess-delete';
import MessFormDrawer from './mess-form';
import MessProfileImage from './mess-view';

export const MessesList = () => {
  const messesQuery = useMesses();

  const columns = useMemo<MRT_ColumnDef<MessResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        // Footer: () => {
        //   return (
        //     <>{`${messesQuery.data?.data.length ?? 0} Messes.`}</>
        //   );
        // },
        Cell: ({ row }) => <MessProfileImage mess={row.original} />,
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
      data: messesQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: messesQuery.data?.data?.length ?? 0,
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
              <MessFormDrawer initialValues={row.original!} />
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
        return <MessFormDrawer />;
      },
    }),
    [columns, messesQuery.data?.data],
  );

  const state: Partial<MRT_TableState<MessResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: messesQuery.isLoading,
    }),
    [messesQuery.isLoading],
  );

  return (
    <GenericTable
      data={messesQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

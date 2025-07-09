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
import { MenuCycleResponse } from '@/interfaces/mess/menu-cycle.interface';
import { useMenuCycles } from '@lib/api/mess/menu-cycle/get-all-menu-cycles';

import { DeleteMenuCycle } from './menu-cycle-delete';
import { MenuCycleForm } from './menu-cycle-form';
import MenuCycleProfileImage from './menu-cycle-view';
import { GenericDrawer } from '../../core/drawer/drawer';

export const MenuCyclesList = () => {
  const menuCyclesQuery = useMenuCycles();

  const columns = useMemo<MRT_ColumnDef<MenuCycleResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        // Footer: () => {
        //   return (
        //     <>{`${menuCyclesQuery.data?.data.length ?? 0} MenuCycles.`}</>
        //   );
        // },
        Cell: ({ row }) => <MenuCycleProfileImage menuCycle={row.original} />,
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

  const options: MRT_TableOptions<MenuCycleResponse> = useMemo(
    () => ({
      columns,
      data: menuCyclesQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: menuCyclesQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMenuCycle,
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
                <MenuCycleForm initialValues={row.original!} />
              </GenericDrawer>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteMenuCycle menuCycle={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return (
          <GenericDrawer title="Update" trigger={<Button>Add New</Button>}>
            <MenuCycleForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, menuCyclesQuery.data?.data],
  );

  const state: Partial<MRT_TableState<MenuCycleResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: menuCyclesQuery.isLoading,
    }),
    [menuCyclesQuery.isLoading],
  );

  return (
    <GenericTable
      data={menuCyclesQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

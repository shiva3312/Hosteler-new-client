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
import { UserRole } from '@/data/feature';
import { MenuResponse } from '@/interfaces/mess/menu.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';
import { useMenues } from '@lib/api/mess/menu/get-all-menues';

import { DeleteMenu } from './menu-delete';
import { MenuForm } from './menu-form';
import MenuProfileImage from './menu-view';
import { GenericDrawer } from '../../core/drawer/drawer';

export const MenuesList = () => {
  const { data: me } = useMe();
  const isNonAdmin = AuthorizationService.hasLowerRole(
    me?.data?.roles ?? [],
    UserRole.ADMIN,
  );

  const menuesQuery = useMenues();

  const columns = useMemo<MRT_ColumnDef<MenuResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        Cell: ({ row }) => <MenuProfileImage menu={row.original} />,
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

  const options: MRT_TableOptions<MenuResponse> = useMemo(
    () => ({
      columns,
      data: menuesQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: menuesQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveMenu,
      renderRowActions: ({ row, table }) =>
        isNonAdmin ? undefined : (
          <Flex gap="md">
            <Tooltip label="Edit">
              <ActionIcon
                color="blue"
                onClick={() => {
                  table.setEditingRow(row);
                }}
              >
                <GenericDrawer
                  title="Update Menu"
                  trigger={<IconEdit size={25} />}
                >
                  <MenuForm initialValues={row.original!} />
                </GenericDrawer>
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon color="red">
                <DeleteMenu menu={row.original} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ),

      renderTopToolbarCustomActions: () => {
        if (isNonAdmin) return undefined;
        return (
          <GenericDrawer title="Create Menu" trigger={<Button>Add New</Button>}>
            <MenuForm />
          </GenericDrawer>
        );
      },
    }),
    [columns, isNonAdmin, menuesQuery.data?.data],
  );

  const state: Partial<MRT_TableState<MenuResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: menuesQuery.isLoading,
    }),
    [menuesQuery.isLoading],
  );

  return (
    <GenericTable
      data={menuesQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

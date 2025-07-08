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
import { UnitResponse } from '@/interfaces/unit.interface';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@lib/api/unit/get-all-units';

import { DeleteUnit } from './unit-delete';
import UnitFormDrawer from './unit-form';
import UnitProfileImage from './unit-view';

export const UnitsList = () => {
  const unitsQuery = useUnits({
    params: SearchQuery.unitSearchQuery({}),
  });
  const { data: organizations } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
  });

  const columns = useMemo<MRT_ColumnDef<UnitResponse>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        size: 250,
        Cell: ({ row }) => <UnitProfileImage unit={row.original} />,
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
          const organization = organizations?.data.find(
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
    [organizations?.data],
  );

  const options: MRT_TableOptions<UnitResponse> = useMemo(
    () => ({
      columns,
      data: unitsQuery.data?.data ?? [],
      getRowId: (row) => row._id ?? '',
      rowCount: unitsQuery.data?.data?.length ?? 0,
      editDisplayMode: 'custom',
      // onEditingRowSave: handleSaveUnit,
      renderRowActions: ({ row, table }) => (
        <Flex gap="md">
          <Tooltip label="Edit">
            <ActionIcon
              color="blue"
              onClick={() => {
                table.setEditingRow(row);
              }}
            >
              <UnitFormDrawer initialValues={row.original!} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon color="red">
              <DeleteUnit unit={row.original} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ),

      renderTopToolbarCustomActions: () => {
        return <UnitFormDrawer />;
      },
    }),
    [columns, unitsQuery.data?.data],
  );

  const state: Partial<MRT_TableState<UnitResponse>> = useMemo(
    () => ({
      columnPinning: {
        left: ['check'],
        right: ['mrt-row-actions'],
      },
      isLoading: unitsQuery.isLoading,
    }),
    [unitsQuery.isLoading],
  );

  return (
    <GenericTable
      data={unitsQuery.data?.data ?? []}
      columns={columns}
      options={options}
      state={state}
    />
  );
};

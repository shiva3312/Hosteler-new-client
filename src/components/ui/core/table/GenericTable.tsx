//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
// eslint-disable-next-line check-file/filename-naming-convention
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; // if using Mantine date picker features
import 'mantine-react-table/styles.css'; // ensure MRT styles are imported once
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_TableState,
  type MRT_TableOptions,
} from 'mantine-react-table';

interface GenericTableProps<TData extends MRT_RowData> {
  data: TData[];
  columns: MRT_ColumnDef<TData>[];
  state?: Partial<MRT_TableState<TData>>;
  options?: MRT_TableOptions<TData>;
}

const GenericTable = <TData extends object>({
  data,
  columns,
  state,
  options,
}: GenericTableProps<TData>) => {
  const table = useMantineReactTable({
    columns: columns ?? [],
    data: data ?? [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowNumbers: true,
    enableColumnPinning: true,
    enableEditing: true,
    enableFullScreenToggle: true,
    enableDensityToggle: true,
    enableColumnActions: true,
    enableColumnFilters: true,
    enableFilters: true,
    enableSorting: true,
    enablePagination: false,
    enableRowActions: true,

    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowVirtualization: false,

    // Toolbar
    enableToolbarInternalActions: true,
    enableTopToolbar: true,
    enableBottomToolbar: false,

    // // Table Body
    // mantineTableBodyCellProps: {
    //   style: {
    //     paddingTop: 4,
    //     paddingBottom: 4,
    //   },
    // },

    // // Table Footer
    // mantineTableFooterCellProps: {
    //   style: {
    //     padding: 4,
    //   },
    // },

    // // Table Header
    // mantineTableHeadCellProps: {
    //   style: {
    //     paddingTop: 4,
    //     paddingBottom: 4,
    //   },
    // },

    mantineTableContainerProps: {
      style: { maxHeight: 'calc(100vh - 150px)' },
    },

    mantineTableProps: {
      //   className: clsx(classes.table),
      // highlightOnHover: false,
      striped: 'odd',
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },

    ...options,

    initialState: {
      density: 'xs',
    },

    state: {
      ...state,
    },
  });

  return <MantineReactTable table={table} />;
};

export default GenericTable;

// ใช้ @tanstack/react-table แบบเวอร์ชัน 8
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  ColumnMeta,
  SortingState
} from '@tanstack/react-table';
import Form from 'react-bootstrap/Form';
import '@/assets/styles/table.scss';
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from 'react-icons/lu';

export enum CFilterType {
  Text = 1,
  Number,
  Date,
  Dropdown
}

interface CustomColumnMeta<T> extends ColumnMeta<T, unknown> {
  filterType?: CFilterType | null;
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  filterType: CFilterType | null;
  sortable?: boolean;
}

export interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[]; // user-defined column config
}

function CustomTable<T extends object>({ data, columns }: CustomTableProps<T>) {
  const columnDefs = React.useMemo<ColumnDef<T, unknown>[]>(
    () =>
      columns.map(col => ({
        id: String(col.accessor),
        accessorKey: col.accessor as string,
        header: col.header,
        meta: {
          filterType: col.filterType,
        } as CustomColumnMeta<T>,
        cell: info => info.getValue(),
        enableSorting: col.sortable || false,
        enableColumnFilter: true,
      })),
    [columns]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },

  });

  const resolveFilterType = (header: any) => {
    let type = header.column.columnDef.meta.filterType;

    switch (type) {
      case CFilterType.Text:
        return <Form.Control
          type="text"
          onChange={e => header.column.setFilterValue(e.target.value)}
          className="w-100 filter"
          placeholder='Ab'
        />
      case CFilterType.Number:
        return <Form.Control
          type="number"
          onChange={e => header.column.setFilterValue(e.target.value)}
          className="w-100 filter"
          placeholder='='
        />
      case CFilterType.Date:
        return <Form.Control
          type="date"
          onChange={e => header.column.setFilterValue(e.target.value)}
          className="w-100 filter"
          placeholder=""
        />
      case CFilterType.Dropdown:
        return <Form.Control
          type="text"
          onChange={e => header.column.setFilterValue(e.target.value)}
          className="w-100 filter"
        />
      default:
        return;
    }

  }

  return (
    <div className="base-table-wrapper">
      <table className="base-table base-table-head">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  <div
                    className="mb-2 d-flex justify-content-between align-items-center"
                    style={{ maxWidth: '200px' }}
                  >
                    <div
                      className="text-truncate"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>

                    {header.column.getCanSort() && (
                      <span
                        className="text-muted ms-2"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          flexShrink: 0,
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        }}
                      >
                        {header.column.getIsSorted() === 'desc' ? (
                          <LuArrowDown size={12} />
                        ) : header.column.getIsSorted() === 'asc' ? (
                          <LuArrowUp size={12} />
                        ) : (
                          <LuArrowUpDown size={12} />
                        )}
                      </span>
                    )}

                  </div>

                  {(header.column.columnDef.meta as CustomColumnMeta<T>)?.filterType &&
                    header.column.getCanFilter() && (
                      resolveFilterType(header)
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      </table>

      <div className="scroll-body">
        <table className="base-table">
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default CustomTable;

import React from 'react';
import { Table } from 'react-bootstrap';

export interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function CustomTable<T extends object>({ data, columns }: CustomTableProps<T>) {
  return (
    <div className="base-table-wrapper">
      <Table hover responsive className="base-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>{item[col.accessor] as React.ReactNode}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CustomTable;

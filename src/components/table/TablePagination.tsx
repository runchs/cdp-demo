import React, { useState } from 'react';
import BaseTable, { Column } from './BaseTable';
import BasePagination from './Pagination';
import '@/assets/styles/table.scss';

interface TablePaginationProps<T> {
  data: T[];
  columns: Column<T>[];
  perPage?: number;
}

function TablePagination<T extends object>({
  data,
  columns,
  perPage = 10,
}: TablePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const currentData = data.slice(startIdx, startIdx + perPage);

  return (
    <div className="table-container">
      <BaseTable data={currentData} columns={columns} />
      <BasePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

export default TablePagination;

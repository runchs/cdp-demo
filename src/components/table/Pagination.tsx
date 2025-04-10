import React, { useState, useEffect } from "react";
import { Pagination } from 'react-bootstrap';
import '@/assets/styles/pagination.scss';

export interface IPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage?: number;
}

interface TablePaginationProps {
    pagination: IPagination;
    onPageChange?: (page: number) => void;
}

const BasePagination: React.FC<TablePaginationProps> = ({
    pagination={
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        perPage: 10, // 👈 กำหนด default ที่นี่ก็ได้
    },
    onPageChange,
}) => {

    const perPage = pagination.perPage ?? 10; // 👈 Default to 10 ถ้า undefined

    const startItem = (pagination.currentPage - 1) * perPage + 1;
    const endItem = Math.min(pagination.currentPage * perPage, pagination.totalItems);

    const handleClick = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            onPageChange?.(page);
        }
    };

    return (
        <div className="mt-4 pagination-wrapper">
            <div className="text-center">
                <Pagination>
                    <Pagination.First onClick={() => handleClick(1)} disabled={pagination.currentPage === 1} className="fs-1"/>
                    <Pagination.Prev onClick={() => handleClick(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} />

                {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === pagination.currentPage}
                        onClick={() => handleClick(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handleClick(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages} />
                <Pagination.Last onClick={() => handleClick(pagination.totalPages)} disabled={pagination.currentPage === pagination.totalPages} />
            </Pagination>
            <div className="text-muted fs-7">{startItem} to {endItem} of {pagination.totalItems} rows</div>
            </div>
            
        </div>
    );
};

export default BasePagination;

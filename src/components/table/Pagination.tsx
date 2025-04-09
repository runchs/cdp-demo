import React from 'react';
import { Pagination } from 'react-bootstrap';

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const BasePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handleClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="d-flex flex-column align-items-end mt-4">
            <Pagination >
                <Pagination.First onClick={() => handleClick(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1} />

                {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handleClick(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handleClick(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
            {/* <div>1 to 10 of 100 rows</div> */}
        </div>

    );
};

export default BasePagination;

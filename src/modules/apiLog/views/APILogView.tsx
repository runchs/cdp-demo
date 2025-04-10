import React, { useState, useEffect } from "react";
import Table, { Column } from "@/components/table/Table";
import Pagination, { IPagination } from "@/components/table/Pagination";

interface IAPILog {
  traceId: string;
  serviceName: string;
  endpoint: string;
  reqMessage: string;
  reqDateTime: string;
  respCode: string;
  respMessage: string;
  respDateTime: string;
  timeUsage: string;
  // action: React.ReactNode
}

const columns: Column<IAPILog>[] = [
  { header: 'Trace ID', accessor: 'traceId' },
  { header: 'Service name', accessor: 'serviceName' },
  { header: 'Endpoint', accessor: 'endpoint' },
  { header: 'Request message', accessor: 'reqMessage' },
  { header: 'Request date time', accessor: 'reqDateTime' },
  { header: 'Response code', accessor: 'respCode' },
  { header: 'Response message', accessor: 'respMessage' },
  { header: 'Response date time', accessor: 'respDateTime' },
  { header: 'Time usage', accessor: 'timeUsage' },
  // { header: 'Action', accessor: 'action' },
];

const APILogView: React.FC = () => {

  const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState<IPagination>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
    });

    // const action = () => {
    //     return <div className="btn btn-primary">test</div>
    // }

    const fetchData = async (page: number) => {
        // จำลองการเรียก API
        const mockData: IAPILog[] = Array.from({ length: 10 }, (_, i) => ({
          traceId: `TAG0000000000${i + 1}`,
          serviceName: `Name${i + 1}`,
          endpoint: `http://test.com`,
          reqMessage: `Message ${i + 1}`,
          reqDateTime: `2021-01-01 00:00:00`,
          respCode: `200`,
          respMessage: `Message ${i + 1}`,
          respDateTime: `2021-01-01 00:00:00`,
          timeUsage: `100`,
          // action: action(),
        }));

        setData(mockData);
        setPagination({
            currentPage: 1,
            totalPages: 3,
            totalItems: 25,
        });
    };

    useEffect(() => {
        fetchData(pagination.currentPage);
    }, []);

    const handlePageChange = (page: number) => {
        // fetchData(page); // ยิง API แล้วอัปเดต currentPage

        setPagination({
          currentPage: 2,
          totalPages: 3,
          totalItems: 25,
      });
    };


  return (
    <div className="p-4 h-100">
      <div className="text-start fw-bold fs-3 pb-4">API Log</div>
      <div className="table-container">
        <Table data={data} columns={columns} />
        <Pagination pagination={pagination} onPageChange={(page) => handlePageChange(page)} />
      </div>
    </div>
  );
};

export default APILogView;
import React, { useState, useEffect } from "react";
import TablePagination from "@/components/table/TablePagination";
import { Column } from '@/components/table/BaseTable';


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
  }
  
  const mockData: IAPILog[] = Array.from({ length: 35 }, (_, i) => ({
    traceId: `TAG0000000000${i + 1}`,
    serviceName: `Name${i + 1}`,
    endpoint: `http://test.com`,
    reqMessage: `Message ${i + 1}`,
    reqDateTime: `2021-01-01 00:00:00`,
    respCode: `200`,
    respMessage: `Message ${i + 1}`,
    respDateTime: `2021-01-01 00:00:00`,
    timeUsage: `100`,
  }));
  
  const userColumns: Column<IAPILog>[] = [
    { header: 'Trace ID', accessor: 'traceId' },
    { header: 'Service name', accessor: 'serviceName' },
    { header: 'Endpoint', accessor: 'endpoint' },
    { header: 'Request message', accessor: 'reqMessage' },
    { header: 'Request date time', accessor: 'reqDateTime' },
    { header: 'Response code', accessor: 'respCode' },
    { header: 'Response message', accessor: 'respMessage' },
    { header: 'Response date time', accessor: 'respDateTime' },
    { header: 'Time usage', accessor: 'timeUsage' },
  ];

const APILogView: React.FC = () => {
    return (
        <div className="p-4 h-100">
            <div className="text-start fw-bold fs-3 pb-4">API Log</div>
            <TablePagination data={mockData} columns={userColumns} perPage={10} />
        </div>
    );
};

export default APILogView;
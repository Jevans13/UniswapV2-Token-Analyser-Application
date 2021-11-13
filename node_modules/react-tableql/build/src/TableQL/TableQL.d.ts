import { FC } from 'react';
import '../index.css';
import { PaginationData } from '../components/Pagination/Pagination';
import { Styles, ColumnConfig } from '../components/Table/Table';
export interface PaginationConfig {
    pageLimit?: number;
    pageNeighbors?: number;
    currentPage?: number;
    onPageChanged?: (paginationData: PaginationData) => void;
    styles?: string;
}
export interface FailSafe {
    reason: string;
}
export interface Props {
    data: object[] | object | [];
    loading?: boolean;
    error?: Error;
    errorMessage?: string;
    columns?: (string | ColumnConfig)[];
    pagination?: PaginationConfig | boolean;
    styles?: Styles;
    onRowClick?: (data: {
        [key: string]: unknown;
    }) => void;
    sort?: boolean;
    debug?: boolean;
    onEmpty?: FC<FailSafe>;
}
declare const TableQL: FC<Props>;
export default TableQL;

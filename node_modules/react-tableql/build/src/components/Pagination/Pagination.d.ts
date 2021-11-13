import { FC } from 'react';
import './Pagination.css';
export interface PaginationData {
    currentPage?: number;
    totalPages?: number;
    pageLimit?: number;
    totalRecords?: number;
}
export interface Props {
    totalRecords: number;
    pageLimit?: number;
    pageNeighbors?: number;
    onPageChanged?: (returnedData: PaginationData) => void;
    selectedPage?: number;
    log: (tag: string, load?: unknown) => void;
    styles?: string;
}
declare const Pagination: FC<Props>;
export default Pagination;

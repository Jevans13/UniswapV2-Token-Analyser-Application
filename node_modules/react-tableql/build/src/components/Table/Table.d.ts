import { FC } from 'react';
import '../../index.css';
export interface ColumnConfig {
    id: string;
    label?: string;
    component?: (data: unknown) => void;
    customColumn?: boolean;
    headerStyle?: string;
    nodeStyle?: string | ((data: unknown) => void);
    sort?: boolean | ((newOrder: any, property: string) => void);
}
export interface Styles {
    table?: string;
    thead?: string;
    theadTr?: string;
    theadTh?: string;
    tbody?: string;
    tbodyTr?: string;
    tbodyTd?: string;
}
export interface Props {
    log: (tag: string, load?: unknown) => void;
    displayData: {
        [key: string]: unknown;
    }[];
    dataKeys: (string | ColumnConfig)[];
    styles?: Styles;
    onRowClick?: (data: {
        [key: string]: unknown;
    }) => void;
    sort?: boolean;
    debug?: boolean;
    onSort?: (column: ColumnConfig | string) => void;
}
declare const Table: FC<Props>;
export default Table;

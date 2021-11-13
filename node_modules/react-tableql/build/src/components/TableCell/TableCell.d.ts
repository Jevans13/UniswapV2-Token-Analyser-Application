import { FC } from 'react';
import { ColumnConfig, Styles } from '../Table/Table';
interface TableCellProps {
    column: string | ColumnConfig;
    columnIndex: number;
    styles: Styles;
    data: {
        [key: string]: unknown;
    };
}
declare const TableCell: FC<TableCellProps>;
export default TableCell;

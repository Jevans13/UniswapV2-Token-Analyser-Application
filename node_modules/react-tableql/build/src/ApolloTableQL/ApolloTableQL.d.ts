import { FC } from 'react';
import { QueryHookOptions } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { PaginationConfig } from '../TableQL/TableQL';
import { Styles, ColumnConfig } from '../components/Table/Table';
export interface ComponentProps {
    query: DocumentNode | string;
    columns?: (string | ColumnConfig)[];
    pagination?: PaginationConfig | boolean;
    styles?: Styles;
    onRowClick?: (data: {
        [key: string]: unknown;
    }) => void;
    errorMessage?: string;
    debug?: boolean;
    sort?: boolean;
}
declare type Props = ComponentProps & Omit<QueryHookOptions, 'query'>;
declare const ApolloTableQL: FC<Props>;
export default ApolloTableQL;

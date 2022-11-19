import React, {useMemo} from 'react';
import { useTable, UseTableOptions} from 'react-table';
import {useNavigate} from "react-router";
import styles from './Table.module.scss';
import cx from 'classnames';


interface TableProps<TRow extends object> {
    rows: TRow[];
    columns: UseTableOptions<TRow>["columns"]
    linkBuilder: ({ row }: { row: TRow }) => string
}

function Table<T extends object>({ rows: rowsProp, columns, linkBuilder } : TableProps<T>) {
    const navigate = useNavigate();
    const data = useMemo(() => rowsProp, [rowsProp]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable<T>({ columns, data });

    return (
        <table {...getTableProps()} className={styles.Table}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th{...column.getHeaderProps()}>
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                    <tr
                        {...row.getRowProps()}
                        className={cx({
                            [styles.Row]: true,
                            [styles.Clickable]: linkBuilder,
                        })}
                        onClick={linkBuilder ? () => navigate(linkBuilder({ row: row.original })) : undefined}
                    >
                        {row.cells.map(cell => {
                            return (
                                <td{...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default Table;

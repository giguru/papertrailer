import React, {useMemo} from 'react';
import { useTable, UseTableOptions} from 'react-table';
import {useNavigate} from "react-router";

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
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th
                            {...column.getHeaderProps()}
                            style={{
                                background: '#657',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
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
                        onClick={linkBuilder ? () => navigate(linkBuilder({ row: row.original })) : undefined}
                    >
                        {row.cells.map(cell => {
                            return (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '10px',
                                        border: 'solid 0.6px gray',
                                        background: '#fff'
                                    }}
                                >
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

import React, {useMemo} from 'react';
import { useTable, UseTableOptions} from 'react-table';
import {useNavigate} from "react-router";
import styles from './Table.module.scss';
import cx from 'classnames';
import {Field, Formik, FormikHelpers, FormikValues} from "formik";
import {Select} from "../forms";
import {OptionInterface} from "../forms/utils";
import Button from "../button/Button";


interface TableProps<TRow extends object> {
    rows: TRow[];
    checkboxes?: boolean,
    columns: UseTableOptions<TRow>["columns"]
    idKey: keyof TRow
    footerContent?: React.ReactNode
    linkBuilder: ({ row }: { row: TRow }) => string,
    checkboxActions?: OptionInterface[]
    onSubmit: (action: OptionInterface['value'], values: FormikValues, helpers: FormikHelpers<any>) => boolean
}

function Table<T extends {}>({ rows: rowsProp, columns, linkBuilder, checkboxes, idKey, checkboxActions, onSubmit, footerContent } : TableProps<T>) {
    const navigate = useNavigate();
    const data = useMemo(() => rowsProp, [rowsProp]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable<T>({ columns, data });

    const initValues: { keys: Array<string>, action: string } = {
        keys: [],
        action: '',
    }
    return (
        <Formik
            initialValues={initValues}
            onSubmit={(values, helpers) => {
                const res = onSubmit(values.action, values, helpers);
                helpers.setSubmitting(false)

                if (res) {
                    helpers.setValues(initValues);
                }
            }}
        >
            {({ values, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <table {...getTableProps()} className={styles.Table}>
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {checkboxes && <th>&nbsp;</th>}
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
                            const idKeyValue = row.original[idKey];

                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className={cx({
                                        [styles.Row]: true,
                                        [styles.Clickable]: linkBuilder,
                                    })}
                                    onClick={linkBuilder ? () => navigate(linkBuilder({ row: row.original })) : undefined}
                                >
                                    {checkboxes && (
                                        <td onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            {row.original[idKey] && (
                                                <Field
                                                    name="keys"
                                                    className={styles.Checkbox}
                                                    // @ts-ignore
                                                    value={idKeyValue}
                                                    checked={values.keys.indexOf(`${idKeyValue}`) > -1}
                                                    type="checkbox"
                                                />
                                            )}
                                        </td>
                                    )}
                                    {row.cells.map((cell, cellIdx) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                key={cellIdx}
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
                    {(values.keys.length > 0 || footerContent) && (
                        <footer className={styles.SummaryFooter}>
                            {values.keys.length > 0 && (
                                <div className={styles.Content}>
                                    <Select.Formik
                                        label="Choose action"
                                        name="action"
                                        options={checkboxActions || []}
                                    />
                                    {values.action && (
                                        <Button type="submit" variant="contained" className="ml-3">Submit</Button>
                                    )}
                                </div>
                            )}
                            {footerContent}
                        </footer>
                    )}
                </form>
            )}
        </Formik>
    );
}

export default Table;

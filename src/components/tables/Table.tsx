import React, {Fragment, useMemo, useState} from 'react';
import {Row, useTable, UseTableOptions} from 'react-table';
import {useNavigate} from "react-router";
import _ from 'lodash';
import styles from './Table.module.scss';
import cx from 'classnames';
import {Field, Formik, FormikHelpers, FormikValues} from "formik";
import {Select} from "../forms";
import {OptionInterface} from "../forms/utils";
import Button from "../button/Button";
import {Edit, Save} from "@mui/icons-material";
import {Modal} from "@mui/material";
import ModalBox from "../layout/ModalBox";

interface TableProps<TRow extends object> {
    rows: TRow[];
    checkboxes?: boolean,
    columns: UseTableOptions<TRow>["columns"]
    idKey: keyof TRow
    footerContent?: React.ReactNode
    linkBuilder?: ({ row }: { row: TRow }) => string,
    checkboxActions?: OptionInterface[]
    editForm?: ({ row, onSuccess }: { row: TRow, onSuccess: () => void }) => JSX.Element,
    onCheckboxSubmit?: (action: OptionInterface['value'], values: FormikValues, helpers: FormikHelpers<any>) => boolean
}

function Table<T extends { id: number }>({ rows: rowsProp, columns, linkBuilder, checkboxes, idKey, checkboxActions, onCheckboxSubmit, footerContent, editForm: EditForm } : TableProps<T>) {
    const navigate = useNavigate();
    const data = useMemo(() => rowsProp, [rowsProp]);
    const [rowToEdit, setRowToEdit] = useState<T | undefined>()

    const extendedColumns = useMemo(() => {
        const editColumn : UseTableOptions<T>["columns"] = [{ Header: '', accessor: 'id', Cell: ({ row }: { row: Row<T>}) => <Button className="mx-0 border-0"><Edit onClick={() => setRowToEdit(row.original)} /></Button>}];
        return [...columns, ...(EditForm ? editColumn : [])];
    }, [columns, EditForm])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable<T>({ columns: extendedColumns, data });

    const close = () => setRowToEdit(undefined);
    const initValues: { keys: Array<string>, action: string } = {
        keys: [],
        action: '',
    }
    return (
        <>
            {rowToEdit && EditForm && (
                <ModalBox
                    onClose={close}
                    header="Editing"
                    size="sm"
                >
                    <EditForm row={rowToEdit} onSuccess={() => { close(); }} />
                </ModalBox>
            )}
            <Formik
                initialValues={initValues}
                onSubmit={(values, helpers) => {
                    if (onCheckboxSubmit) {
                        const res = onCheckboxSubmit(values.action, values, helpers);
                        if (res) {
                            helpers.setValues(initValues);
                        }
                    }
                    helpers.setSubmitting(false)
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
                            {rows.map((row) => {
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
                                                <td {...cell.getCellProps()} key={cellIdx}>
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
        </>
    );
}

export default Table;

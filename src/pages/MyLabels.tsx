import React, {useState} from 'react';
import Page from "../components/layout/page/Page";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";
import DateSpan from "../components/texts/DateSpan";
import UserNameSpan from "../components/texts/UserNameSpan";
import Paragraph from "../components/texts/Paragraph";
import {Row} from "react-table";
import Alert from "@mui/material/Alert";
import {useDeleteLabels, useLabels} from "../api/hooks/labels";
import NewLabelForm from "../components/labels/NewLabelForm";
import {useAuth} from "../components/auth-provider/AuthProvider";
import {ApiLabelInterface} from "../api/models";
import ColorPicker from "../components/forms/ColorPicker";
import _ from "lodash";
import axios from "axios";
import {Formik} from "formik";
import TextInput from "../components/forms/TextInput";
import {Select} from "../components/forms";
import Button from "../components/button/Button";
import {SaveButton} from "../components/forms/Form";

interface SourcesProp {

}

const MyLabels: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { loggedInUser } = useAuth();
    const { error, labels, isLoading, refetch } = useLabels({ with: ['createdBy', 'parent'] });
    const [checkboxError, setCheckboxError] = useState('');
    const { deleteLabels, feedback } = useDeleteLabels({
        onSettled: () => refetch(),
        onError: (err) => {
            setCheckboxError(err.message)
        },
    });

    return (
        <Page>
            <Page.Header>
                My labels
            </Page.Header>
            <Paragraph>
                Organise your files using labels.
            </Paragraph>
            <br />

            <NewLabelForm labels={labels} userId={loggedInUser?.id} onSuccess={refetch} />
            <br />

            {error ? <span>{JSON.stringify(error)}</span> : null}
            {isLoading ? <Loader /> : null}
            {Array.isArray(labels) && (
                <Table
                    rows={labels}
                    // linkBuilder={({ row: source }) => routes.editFile(source.id)}
                    checkboxes
                    idKey="id"
                    columns={[
                        { Header: '', accessor: 'color', Cell: ({ value }: {value: string }) => <ColorPicker value={value} /> },
                        { Header: 'Name', accessor: 'name', Cell: ({ value }: {value: string }) => <strong>{value}</strong> },
                        { Header: 'Parent label', accessor: 'parent', Cell: ({ value }: {value?: ApiLabelInterface }) => value?.name ? <span>{value?.name}</span> : null },
                        { Header: 'Uploaded at', accessor: 'created_at', Cell: ({ value, row }: {value: string, row: Row<typeof labels[0]>}) => (
                            <>
                                <DateSpan date={value} />
                                {row.original.created_by && <UserNameSpan user={row.original.created_by} />}
                            </>
                            )},
                        { Header: 'Last modified', accessor: 'updated_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                    ]}
                    checkboxActions={[
                        { value: 'delete', label: 'Delete' },
                    ]}
                    editForm={({ row, onSuccess }) => {
                        return (
                            <Formik
                                initialValues={_.pick(row, ['color', 'name', 'parent_id'])}
                                onSubmit={(values, { setSubmitting}) => {
                                    axios.put(`/labels/${row.id}`, values)
                                        .then(() => {
                                            onSuccess()
                                            refetch();
                                        })
                                        .finally(() => {
                                            setSubmitting(false)
                                        })
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <ColorPicker.Formik name="color" />
                                        <TextInput.Formik name="name" label="New label name" />
                                        <Select.Formik
                                            label="Parent label"
                                            name="parent_id"
                                            options={labels?.map((label ) => (
                                                { value: `${label.id}`, label: label.name }
                                            )) || []}
                                        />
                                        <SaveButton />
                                    </form>
                                )}
                            </Formik>
                        )
                    }}
                    onCheckboxSubmit={(action, values, helpers) => {
                        setCheckboxError('');
                        if (action === 'delete') {
                            deleteLabels(values.keys)
                            return true;
                        }
                        return false;
                    }}
                    footerContent={(checkboxError || feedback) && (
                        <>
                            {checkboxError && <Alert color="error">{checkboxError}</Alert>}
                            {feedback && <Alert color="success">{feedback}</Alert>}
                        </>
                    )}
                />
            )}
        </Page>
    );
};

export default MyLabels;

import React, {useState} from 'react';
import Page from "../components/layout/page/Page";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";
import {routes} from "../utils/routes";
import {useDeleteFiles, useFiles} from "../api/hooks/files";
import DateSpan from "../components/texts/DateSpan";
import UserNameSpan from "../components/texts/UserNameSpan";
import Paragraph from "../components/texts/Paragraph";
import {Row} from "react-table";
import NewFileButton from "../components/files/NewFileButton";
import Alert from "@mui/material/Alert";
import PublishSwitch from "../components/publish/PublishSwitch";
import LabelDisplay from "../components/labels/LabelDisplay";

interface SourcesProp {

}

const MyFiles: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, files, isLoading, refetch } = useFiles({ with: ['createdBy', 'labels'] });
    const [checkboxError, setCheckboxError] = useState('');
    const { deleteFiles, feedback } = useDeleteFiles({
        onSettled: () => refetch(),
        onError: (err) => {
            setCheckboxError(err.message)
        },
    });

    return (
        <Page>
            <Page.Header>
                My files
                &nbsp;
                <NewFileButton />
            </Page.Header>
            <Paragraph>
                Files are the core of Papertrailer. To create a relation between two files, please upload the files,
                select some text and the rest will show itself!
            </Paragraph>
            <br />

            {error ? <span>{JSON.stringify(error)}</span> : null}
            {isLoading ? <Loader /> : null}
            {Array.isArray(files) && (
                <Table
                    rows={files}
                    linkBuilder={({ row: source }) => routes.editFile(source.id)}
                    checkboxes
                    idKey="id"
                    columns={[
                        { Header: 'Title', accessor: 'title', Cell: ({ value, row }: {value: string, row: Row<typeof files[0]>}) => (
                            <>
                                <strong>{value}</strong>
                                {row.original.description && <><br/><small>{row.original.description}</small></>}
                                {row.original.labels && (
                                    <><br />{row.original.labels?.map((label) => <LabelDisplay key={label.id} label={label} />)}</>
                                )}
                            </>
                        )},
                        { Header: 'Comments', accessor: 'comments_count' },
                        { Header: 'Relations', accessor: 'relations_count' },
                        { Header: 'Uploaded at', accessor: 'created_at', Cell: ({ value, row }: {value: string, row: Row<typeof files[0]>}) => (
                            <>
                                <DateSpan date={value} />
                                {row.original.created_by && <UserNameSpan user={row.original.created_by} />}
                            </>
                            )},
                        { Header: 'Public', accessor: 'is_public', Cell: ({ value, row }: { value: any, row: Row<typeof files[0]>}) => <PublishSwitch subjectId={row.original.id} defaultChecked={row.original.is_public} /> },
                        { Header: 'Last modified', accessor: 'updated_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                    ]}
                    checkboxActions={[
                        { value: 'delete', label: 'Delete' },
                    ]}
                    onCheckboxSubmit={(action, values, helpers) => {
                        setCheckboxError('');
                        if (action === 'delete') {
                            deleteFiles(values.keys)
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

export default MyFiles;

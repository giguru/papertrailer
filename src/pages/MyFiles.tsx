import React, {useState} from 'react';
import Page from "../components/layout/page/Page";
import Table from "../components/tables/Table";
import tableStyles from "../components/tables/Table.module.scss";
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
import Icons from './../components/Icons';
import EditLabelsModalBox from "../components/modalboxes/EditLabelsModalBox";
import styles from './MyFiles.module.scss';
import {ApiOrganisation, ApiSharingInterface, ApiUserInterface} from "../api/models";
import ShareFileModalBox from "../components/modalboxes/share/ShareFileModalBox";
import TransferOwnershipModalBox from "../components/modalboxes/transfer-ownership/TransferOwnershipModalBox";
import Avatar from "@mui/material/Avatar";


interface SourcesProp {

}

const MyFiles: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, files, isLoading, refetch } = useFiles({ with: ['createdBy', 'labels', 'user', 'organisation', 'sharings.user'] });
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
                                <strong>{value || <i className={styles.NoName}>No name</i>}</strong>
                                {row.original.added_via_extension ? <Icons.AddedViaExtension /> : null}
                                {row.original.description && <><br/><small>{row.original.description}</small></>}
                                {row.original.labels && (
                                    <div>
                                        {row.original.labels?.map((label) => <LabelDisplay key={label.id} label={label} />)}
                                        <span className={row.original.labels?.length ? tableStyles.HoverShow : undefined}>
                                            <EditLabelsModalBox
                                                buttonClassName={styles.InlineLabelsButton}
                                                initLabels={row.original.labels}
                                                endpoint={`files/${row.original.id}?_with[]=labels`}
                                                onSuccess={() => refetch()}
                                            />
                                        </span>
                                    </div>
                                )}
                            </>
                        )},
                        { Header: '', accessor: 'comments_count', Cell: ({ row }: {row: Row<typeof files[0]>}) => (
                            <>
                                {row.original.comments_count ? <div>{row.original.comments_count} <Icons.Comment /></div> : null}
                                {row.original.relations_count ? <div>{row.original.relations_count} <Icons.Relation /></div> : null}
                            </>
                        )},
                        { Header: 'Uploaded at', accessor: 'created_at', Cell: ({ value, row }: {value: string, row: Row<typeof files[0]>}) => (
                            <>
                                <DateSpan date={value} />
                                {row.original.created_by && <UserNameSpan user={row.original.created_by} />}
                            </>
                        )},
                        { Header: 'Public', accessor: 'is_public', Cell: ({ value, row }: { value: any, row: Row<typeof files[0]>}) => <PublishSwitch subjectId={row.original.id} defaultChecked={row.original.is_public} /> },
                        { Header: 'Last modified', accessor: 'updated_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                        {
                            Header: 'Owner',
                            accessor: 'user',
                            Cell: ({ row }: { row: Row<typeof files[0]> }) => (
                                <span>
                                    {/* @ts-ignore */}
                                    {row.original.user
                                        ? (
                                            <Avatar
                                                alt={`${row.original.user.first_name} ${row.original.user.last_name}`}
                                                src="/static/images/avatar/2.jpg"
                                            />
                                        )
                                        : row.original.organisation?.name}
                                    <span className={tableStyles.HoverShow}>
                                        <TransferOwnershipModalBox file={row.original} onSuccess={() => refetch()} />
                                    </span>
                                </span>
                            ),
                        },
                        {
                            Header: 'Shared with',
                            accessor: 'sharings',
                            Cell: ({ value, row }: { value?: ApiSharingInterface[], row: Row<typeof files[0]> }) => (
                                <span>
                                    {value?.map(i => i.user.first_name).join(', ')}
                                    <span className={value?.length ? tableStyles.HoverShow : undefined}>
                                        <ShareFileModalBox
                                            fileId={row.original.id}
                                            sharings={value || []}
                                            onSuccess={() => refetch()}
                                        />
                                    </span>
                                </span>
                            ),
                        },
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
            <div className="spacer" />
        </Page>
    );
};

export default MyFiles;

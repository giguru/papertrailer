import React from 'react';
import Page from "../components/layout/page/Page";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";
import {routes} from "../utils/routes";
import {useFiles} from "../api/hooks/files";
import DateSpan from "../components/texts/DateSpan";
import {ApiUserInterface} from "../api/models";
import UserNameSpan from "../components/texts/UserNameSpan";
import Button from "@mui/material/Button";
import ModalBox from "../components/layout/ModalBox";
import Paragraph from "../components/texts/Paragraph";
import {FileUpload} from "../components/forms/FileUploader";
import FileUploaderList from "../components/forms/FileUploaderList";
import {Row} from "react-table";

interface SourcesProp {

}

const acceptTypes = '.pdf, .jpg, .jpeg, .png, .docx, .doc, .pptx, .ppt';

const MyFiles: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, files, isLoading } = useFiles({ with: ['createdBy'] });

    return (
        <Page>
            <Page.Header>
                My files
                <ModalBox.ViaButton
                    buttonText="New file"
                    header="Upload new files"
                    closeButtonText="Finish uploading"
                    variant="outlined"
                >
                    <Paragraph>
                        The following files types are accepted: &nbsp;
                        <strong className="colorPrimary">{acceptTypes}</strong>
                        <br />
                        <strong>The uploaded files will be converted into pdf's and cannot be changed afterwards.</strong>
                    </Paragraph>
                    <FileUploaderList
                        endpoint="/files"
                        accept={acceptTypes}
                    />
                </ModalBox.ViaButton>
            </Page.Header>
            <Paragraph>
                Files are the core of Papertrailer. To create a relation between two files, please upload the files,
                select some text and the rest will show itself!
            </Paragraph>
            {error ? <span>{JSON.stringify(error)}</span> : null}
            {isLoading ? <Loader /> : null}
            {Array.isArray(files) && (
                <Table
                    rows={files}
                    linkBuilder={({ row: source }) => routes.editFile(source.id)}
                    columns={[
                        { Header: 'Title', accessor: 'title', Cell: ({ value, row }: {value: string, row: Row<typeof files[0]>}) => <><strong>{value}</strong><br/>{row.original.description && <small>{row.original.description}</small>}</> },
                        { Header: 'Comments', accessor: 'comments_count' },
                        { Header: 'Relations', accessor: 'relations_count' },
                        { Header: 'Uploaded at', accessor: 'created_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                        { Header: 'Uploader', accessor: 'created_by', Cell: ({ value }: { value: any }) => value && <UserNameSpan user={value} /> },
                        { Header: 'Last modified', accessor: 'updated_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                    ]}
                />
            )}
        </Page>
    );
};

export default MyFiles;

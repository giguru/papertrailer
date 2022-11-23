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

interface SourcesProp {

}

const acceptTypes = '.pdf, .jpg, .jpeg, .png, .docx, .doc, .pptx, .ppt';

const Sources: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, files, isLoading } = useFiles({ with: ['createdBy'] });

    return (
        <Page>
            <Page.Header>
                My files
                <ModalBox.ViaButton buttonText="Add new modal" header="Upload new files">
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
            <p>
                Files are the core of Papertrailer. To create a relation between two files, please upload the files,
                select some text and the rest will show itself!
            </p>
            {error ? <span>{JSON.stringify(error)}</span> : null}
            {isLoading ? <Loader /> : null}
            {Array.isArray(files) && (
                <Table
                    rows={files}
                    linkBuilder={({ row: source }) => routes.editFile(source.id)}
                    columns={[
                        { Header: 'Title', accessor: 'title' },
                        { Header: 'Description', accessor: 'description' },
                        { Header: 'Created', accessor: 'created_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                        { Header: 'Uploader', accessor: 'created_by', Cell: ({ value }: { value: any }) => value && <UserNameSpan user={value} /> },
                        { Header: 'Last modified', accessor: 'updated_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                    ]}
                />
            )}
        </Page>
    );
};

export default Sources;

import React from 'react';
import Page from "../components/layout/page/Page";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";
import {routes} from "../utils/routes";
import {useFiles} from "../api/hooks/files";
import DateSpan from "../components/texts/DateSpan";
import {ApiUserInterface} from "../api/models";
import UserNameSpan from "../components/texts/UserNameSpan";

interface SourcesProp {

}

const Sources: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, files, isLoading } = useFiles({ with: ['createdBy'] });

    return (
        <Page>
            <Page.Header>My sources</Page.Header>
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

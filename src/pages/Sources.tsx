import React from 'react';
import Page from "../components/layout/page/Page";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";
import {routes} from "../utils/routes";
import {useFiles} from "../api/hooks/files";
import DateSpan from "../components/texts/DateSpan";

interface SourcesProp {

}

const Sources: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, files, isLoading } = useFiles();

    return (
        <Page>
            <Page.Header>Sources</Page.Header>
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
                        { Header: 'Last modified', accessor: 'updated_at', Cell: ({ value }: {value: string}) => <DateSpan date={value} /> },
                    ]}
                />
            )}
        </Page>
    );
};

export default Sources;

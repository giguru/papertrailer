import React from 'react';
import Page from "../components/layout/page/Page";
import {useSources} from "../api/hooks/sources";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";
import {routes} from "../utils/routes";

interface SourcesProp {

}

const Sources: React.FC<SourcesProp> = (props: SourcesProp) => {
    const { error, sources, isLoading } = useSources();
    return (
        <Page>
            <Page.Header>Sources</Page.Header>
            {error ? <span>{JSON.stringify(error)}</span> : null}
            {isLoading ? <Loader /> : null}
            {Array.isArray(sources) && (
                <Table
                    rows={sources}
                    linkBuilder={({ row: source }) => routes.editFile(source.id)}
                    columns={[
                        { Header: 'Title', accessor: 'title' },
                        { Header: 'Created', accessor: 'created_at' },
                        { Header: 'Last modified', accessor: 'updated_at' },
                    ]}
                />
            )}
        </Page>
    );
};

export default Sources;

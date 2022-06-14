import React from 'react';
import Page from "../components/layout/page/Page";
import {useSources} from "../api/hooks/sources";
import Table from "../components/tables/Table";
import Loader from "../components/loader/Loader";

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
                    columns={[
                        { headerName: 'Title', field: 'title', flex: 1, filterable: false, sortable: false, hideable: false },
                        { headerName: 'Created', field: 'created_at', filterable: false, sortable: false, hideable: false },
                        { headerName: 'Last modified', field: 'updated_at', filterable: false, sortable: false, hideable: false },
                    ]}
                />
            )}
        </Page>
    );
};

export default Sources;

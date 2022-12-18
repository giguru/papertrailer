import React from 'react';
import Page from "../components/layout/page/Page";
import NewOrganisationButton from "../components/organisations/NewOrganisationButton";
import Paragraph from "../components/texts/Paragraph";
import Loader from "../components/loader/Loader";
import Table from "../components/tables/Table";
import {routes} from "../utils/routes";
import {Row} from "react-table";
import {useOrganisations} from "../api/hooks/organisations";

function MyOrganisations() {
    const { error, organisations, isLoading, refetch } = useOrganisations({});

    return (
        <Page>
            <Page.Header>
                My Organisations
                &nbsp;
                <NewOrganisationButton onSuccess={refetch} />
            </Page.Header>
            <Paragraph>
                Share files and knowledge with all members! Files owned by the organisation stay with the organisation.
            </Paragraph>

            {error ? <span>{JSON.stringify(error)}</span> : null}
            {isLoading ? <Loader /> : null}
            {Array.isArray(organisations) && (
                <Table
                    rows={organisations}
                    linkBuilder={({ row: source }) => routes.editFile(source.id)}
                    checkboxes
                    idKey="id"
                    columns={[
                        { Header: 'Name', accessor: 'name', Cell: ({ value, row }: {value: string, row: Row<typeof organisations[0]>}) => <strong>{value}</strong>},
                    ]}
                />
            )}
        </Page>
    );
}

export default MyOrganisations;

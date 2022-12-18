import React from 'react';
import Page from "../components/layout/page/Page";
import NewFileButton from "../components/files/NewFileButton";
import Paragraph from "../components/texts/Paragraph";

function MyOrganisations() {
    return (
        <Page>
            <Page.Header>
                My Organisations
                &nbsp;
                <NewFileButton />
            </Page.Header>
            <Paragraph>
                Share files and knowledge with all members! Files owned by the organisation stay with the organisation.
            </Paragraph>
        </Page>
    );
}

export default MyOrganisations;

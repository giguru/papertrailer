import React from 'react';
import PageHeader from "./PageHeader";
import {Container} from "@mui/material";

interface PageProp {
    children: React.ReactNode | React.ReactNode[],
    inContainer?: boolean,
}

function Page({ children, inContainer = true } : PageProp) {
    return inContainer
        ? <Container>{children}</Container>
        : <>{children}</>;
}
Page.Header = PageHeader;

export default Page;

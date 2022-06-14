import React from 'react';

interface PageHeaderProps {
    children: React.ReactNode,
}

function PageHeader(props: PageHeaderProps) {
    const { children } = props;

    return (
        <h1>{children}</h1>
    );
}

export default PageHeader;

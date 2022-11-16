import React from 'react';
import PageContainer from "../shared/PageContainer";
import {ApiFileInterface} from "../../../api/models";

function BoundingBoxesViewer({ files }: { files: ApiFileInterface['files'] }) {
    return (
        <>
            {files && Array.isArray(files) && files.map((file) => (
                <PageContainer key={file.id}>{file.id}</PageContainer>
            ))}
        </>
    );
}

export default BoundingBoxesViewer;

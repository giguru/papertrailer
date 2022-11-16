import React from 'react';
import {useFile} from "../../api/hooks/files";
import {useEditorViewerContext} from "./EditorViewerContext";
import { AnySelection } from "./EditorViewer.utils";
import EditorViewerContainer from "./shared/EditorViewerContainer";
import PdfjsViewer from "./mozilla-pdfjs-based/PdfjsViewer";
import styles from "./mozilla-pdfjs-based/PdfjsViewer.module.scss";

interface EditorViewerProps {
    Component: React.FunctionComponent<{ selection: AnySelection }>,
    fileId: string,
}

// A single file viewer
function EditorViewer({ Component, fileId }: EditorViewerProps) {
    const { selectedContent } = useEditorViewerContext();
    const {
        file: fullData,
        isLoading,
        error,
    } = useFile(fileId, { with: ['files', 'files.file_bounding_blocks']});

    // TODO after having loaded all the file data, wisely choose the value for the scaler in the EditorViewerContext.
    return (
        <EditorViewerContainer className={styles.PageCanvas}>
            {!isLoading && typeof error === 'string' ? <span>{error}</span> : null}
            <PdfjsViewer />
            {/*<BoundingBoxesViewer files={fullData?.files} Component={Component} />*/}
            {selectedContent && Component
                && <Component selection={selectedContent} />}
        </EditorViewerContainer>
    );
}

export default EditorViewer;

import React, {useCallback, useEffect} from 'react';
import {useFile} from "../../api/hooks/files";
import {EditorViewerContextProvider, useEditorViewerContext} from "./EditorViewerContext";
import { AnySelection } from "./EditorViewer.utils";
import EditorViewerContainer from "./shared/EditorViewerContainer";
import PdfjsViewer from "./mozilla-pdfjs-based/PdfjsViewer";
import styles from "./mozilla-pdfjs-based/PdfjsViewer.module.scss";
import {useEditorContext} from "./EditorContext";
import FilePanel from "./FilePanel";
import {useFileRelations} from "../../api/hooks/relations";

interface EditorViewerProps {
    Component: React.FunctionComponent<{ selection: AnySelection }>,
    fileId: number | string,
    isActive?: boolean
}

// A single file viewer
function EditorViewer({ Component, fileId, isActive = true }: EditorViewerProps) {
    const { setFile, setRelations } = useEditorViewerContext()
    const {
        file: fullData,
        isLoading,
        error,
    } = useFile(fileId, { with: ['files']});
    const { relations } = useFileRelations(fileId)

    useEffect(() => {
        setFile(fullData)
    }, [fullData])

    useEffect(() => {
        setRelations(relations || [])
    }, [relations])

    const PageChildComponent = useCallback(
        ({ pageIndex }: { pageIndex: number }) => Component && <ComponentRenderer Component={Component} pageIndex={pageIndex} />,
        [Component],
    );

    return (
        <div className={`${styles.EditorViewerLayout}`}>
            <EditorViewerContainer className={styles.PageCanvas}>
                {!isLoading && typeof error === 'string' ? <span>{error}</span> : null}
                {isActive && fullData && (
                    <PdfjsViewer relations={relations || []} file={fullData} PageChildComponent={PageChildComponent} />
                )}
            </EditorViewerContainer>
            <FilePanel fileId={fileId} />
        </div>
    );
}

function ComponentRenderer({ Component, pageIndex }: { Component: EditorViewerProps['Component'], pageIndex: number }) {
    const { selectedContent } = useEditorViewerContext();
    return  selectedContent && selectedContent.pageIndex === pageIndex ? <Component selection={selectedContent} /> : null;
}

export default EditorViewer;

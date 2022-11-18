import React from 'react';
import DraggedSelectionArea from "../shared/DraggedSelectionArea";
import {useEditorViewerContext} from "../EditorViewerContext";

function InteractionInterface({ pageIndex }: { pageIndex: number }) {
    const { selectedContent, clearSelectedContent } = useEditorViewerContext();

    return (
        <>
            {selectedContent
                && typeof selectedContent === 'object'
                && "y" in selectedContent
                && selectedContent.pageIndex === pageIndex
                && (
                    <DraggedSelectionArea
                        coordinates={selectedContent}
                        onClick={clearSelectedContent}
                    />
                )}
        </>
    );
}

export default InteractionInterface;

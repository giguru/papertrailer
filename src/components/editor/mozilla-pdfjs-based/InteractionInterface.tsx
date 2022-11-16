import React from 'react';
import DraggedSelectionArea from "../shared/DraggedSelectionArea";
import {useEditorViewerContext} from "../EditorViewerContext";

function InteractionInterface({ }: { }) {
    const { selectedContent, clearSelectedContent } = useEditorViewerContext();

    return (
        <>
            {selectedContent && typeof selectedContent === 'object' && "y" in selectedContent && (
                <DraggedSelectionArea coordinates={selectedContent} onClick={clearSelectedContent} />
            )}
        </>
    );
}

export default InteractionInterface;

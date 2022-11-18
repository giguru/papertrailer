import React, {useMemo} from 'react';
import {AnySelection} from "./EditorViewer.utils";
import ErrorBoundary from "./../ErrorBoundary";
import FloatingPane from "../FloatingPane";
import {useEditorViewerContext} from "./EditorViewerContext";

interface PopUpProps {
    selection: AnySelection,
    children: React.ReactNode,
    onCancel?: () => void,
    header?: string,
}

function BoundingBoxesSelectionPopUp({ selection, children, onCancel, header }: PopUpProps) {
    const { scaler } = useEditorViewerContext();

    const [topLeft, middle] = useMemo(() => {
        let [lowestLeft, highestRight, lowestY]= [10000000, 0, 1000000];
        if (typeof selection === 'object' && "boundingBlocks" in selection && Array.isArray(selection.boundingBlocks)) {
            selection.boundingBlocks.forEach((bb) => {
                if (bb.y < lowestY) {
                    lowestY = bb.y
                }
                if (bb.x < lowestLeft) {
                    lowestLeft = bb.x;
                }
                if (bb.x + bb.width > highestRight) {
                    highestRight = bb.x + bb.width;
                }
            });
            return [lowestY, (lowestLeft + highestRight) / 2];
        } else if (typeof selection === 'object' && "y" in selection) {
            return [selection.y, (selection.x + selection.width) / 2]
        }
        return [0, 0]
    }, [selection]);


    return (
        <FloatingPane
            position={{
                top: topLeft * scaler,
                left: middle * scaler,
            }}
            onClose={onCancel}
            header={header}
        >
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </FloatingPane>
    );
}

export default BoundingBoxesSelectionPopUp;

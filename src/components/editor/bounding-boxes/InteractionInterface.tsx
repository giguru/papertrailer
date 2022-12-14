import React, {useEffect, useRef, useState, useTransition} from 'react';
import styles from "../EditorView.module.scss";
import {
    cumulativeOffset,
    DragData,
    dragEventToDragData, DragWindow,
    inDragWindow,
    toPercentage
} from "../EditorViewer.utils";
import {useEditorViewerContext} from "../EditorViewerContext";
import {ApiFileInterface} from "../../../api/models";
import DraggedSelectionArea from "../shared/DraggedSelectionArea";
import {boundingBoxesToText} from "../utils";

function InteractionInterface({ file }: { file: ApiFileInterface }) {
    const { scaler, setSelectedContent } = useEditorViewerContext();
    const [isPending, startTransition] = useTransition();

    const initialImageWidth = file.size_width;
    const imageHeight = file.size_height;
    const imageRef = useRef();
    const [dragStart, setDragStart] = useState<DragData>();

    const [drag, setDrag] = useState<DragData>();

    useEffect(() => {
        setDrag(undefined);
        setDragStart(undefined);
    }, [scaler]);

    const imageContainerOffset = imageRef.current ? cumulativeOffset(imageRef.current) : undefined;
    const dragWindow : DragWindow | undefined = drag && dragStart && imageContainerOffset && {
        width: Math.abs(drag.pageX - dragStart.pageX),
        height: Math.abs(drag.pageY - dragStart.pageY),
        x: Math.min(drag.pageX, dragStart.pageX) - imageContainerOffset.left,
        y: Math.min(drag.pageY, dragStart.pageY) - imageContainerOffset.top,
    };

    const boundingBoxes = (file.file_bounding_blocks ? file.file_bounding_blocks : []);
    const selectedBoxes = boundingBoxes.filter(bb => inDragWindow(bb, scaler, dragWindow));

    return (
        <>
            <div
                className={styles.InteractionInterface}
                style={{ width: initialImageWidth * scaler, height: imageHeight * scaler }}
                draggable
                onDragStart={(ev) => {
                    setDragStart(dragEventToDragData(ev))
                }}
                onDrag={(ev) => {
                    if (!isPending) {
                        startTransition(() => {
                            setDrag(dragEventToDragData(ev));
                        });
                    }
                }}
                onDragEnd={() => {

                    setSelectedContent({
                        selected: true,
                        fileId: file.id,
                        pageIndex: 0, // TODO it is not 0
                        text: boundingBoxesToText(selectedBoxes),
                        boundingBlocks: selectedBoxes,
                    });
                    setDrag(undefined);
                    setDragStart(undefined);
                }}
            >
                &nbsp;
            </div>

            {dragWindow && (
                <DraggedSelectionArea coordinates={dragWindow} />
            )}
            {Array.isArray(selectedBoxes) && selectedBoxes.map((d) => {
                return (
                    <div
                        key={d.id}
                        style={{
                            position: 'absolute',
                            left: toPercentage(d.x, initialImageWidth),
                            top: toPercentage(d.y, imageHeight),
                            width: toPercentage(d.width, initialImageWidth),
                            height: toPercentage(d.height, imageHeight),
                        }}
                        className={[styles.BoundingBox, styles.Selected].join(' ')}
                    />
                );
            })}
        </>
    );
}

export default InteractionInterface;

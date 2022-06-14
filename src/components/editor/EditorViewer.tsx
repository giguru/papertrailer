import React, {DragEvent, useContext, useEffect, useRef, useState, useTransition} from 'react';
import {useQuery} from "react-query";
import axios from "axios";
import {ServerGetResponse} from "../../api/api";
import EditorContext from "./EditorContext";
import styles from './EditorView.module.scss';
import {
    inDragWindow,
    cumulativeOffset,
    DragData,
    ApiBoundingBoxes,
    ExtendedBoundingBox,
    DragWindow, toPercentage, dragEventToDragData
} from "./EditorViewer.utils";


function EditorViewer() {
    const { scaler } = useContext(EditorContext);
    const [initialImageWidth, setInitialImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const imageRef = useRef();
    const [imageContainerOffset, setImageContainerOffset] = useState<{top: number, left: number}>();
    const [dragStart, setDragStart] = useState<DragData>();
    const [isPending, startTransition] = useTransition();

    const [drag, setDrag] = useState<DragData>();
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        'sources',
        () => axios.get<ServerGetResponse<ApiBoundingBoxes>>('/process/parse-file', {
            baseURL: 'http://127.0.0.1:5000'
        })
    );

    // @ts-ignore
    const onLoad = ({ target: img }) => {
        setInitialImageWidth(img.offsetWidth);
        setImageHeight(img.offsetHeight);
        setImageContainerOffset(cumulativeOffset(img));
        imageRef.current = img;
    };

    useEffect(() => {
        if (imageRef.current) {
            setImageContainerOffset(cumulativeOffset(imageRef.current))
        }
        setDrag(undefined);
        setDragStart(undefined);
    }, [scaler]);

    const dragWindow : DragWindow | undefined = drag && dragStart && imageContainerOffset && {
        width: Math.abs(drag.pageX - dragStart.pageX),
        height: Math.abs(drag.pageY - dragStart.pageY),
        left: Math.min(drag.pageX, dragStart.pageX) - imageContainerOffset.left,
        top: Math.min(drag.pageY, dragStart.pageY) - imageContainerOffset.top,
    };
    const boundingBoxes = (fullData?.data?.data ? fullData?.data?.data['0'] : []).map<ExtendedBoundingBox>((d) => {
        return {...d, selected: inDragWindow(d, scaler, dragWindow)};
    });

    return (
        <div className={styles.Viewer}>
            <div
                className={styles.ImageContainer}
                style={{ width: initialImageWidth * scaler, height: imageHeight * scaler }}
            >
                <img
                    className={styles.Image}
                    onLoad={onLoad}
                    src={require('./example-paper.pdf-dpi:300-0.jpg')}
                    width={initialImageWidth > 0 ? initialImageWidth * scaler : undefined}
                />
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
                        const selectedBoundingBoxes = boundingBoxes.filter(bb => bb.selected);
                        console.log({ selectedBoundingBoxes });
                        setDrag(undefined);
                        setDragStart(undefined);
                    }}
                >
                    &nbsp;
                </div>

                {drag && dragStart && imageContainerOffset && (
                    <div
                        className={styles.DragArea}
                        style={dragWindow}
                    >
                        &nbsp;
                    </div>
                )}
                {boundingBoxes.map((d) => {
                    return (
                        <div
                            style={{
                                position: 'absolute',
                                left: toPercentage(d.x, initialImageWidth),
                                top: toPercentage(d.y, imageHeight),
                                width: toPercentage(d.width, initialImageWidth),
                                height: toPercentage(d.height, imageHeight),
                            }}
                            className={[
                                styles.BoundingBox,
                                d.selected ? styles.Selected : ''
                            ].join(' ')}
                        />
                    )
                })}

                {!isLoading && typeof error === 'string' ? <span>{error}</span> : null}
            </div>
            <div style={{ background: 'red'}} >A</div>
            <div style={{ background: 'blue'}} >B</div>
            <div style={{ background: 'green'}} >C</div>
        </div>
    );
}

export default EditorViewer;

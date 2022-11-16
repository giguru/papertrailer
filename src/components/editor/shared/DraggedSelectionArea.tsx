import React, {MouseEventHandler} from 'react';
import styles from "../EditorView.module.scss";

interface PropsCoordinates {
    coordinates: {
        x: number
        y: number
        width: number
        height: number
    }
    onClick?: MouseEventHandler<HTMLDivElement>
}

function DraggedSelectionArea({ coordinates, onClick }: PropsCoordinates) {
    return (
        <div className={styles.DragArea} style={{
            left: coordinates.x,
            top: coordinates.y,
            width: coordinates.width,
            height: coordinates.height,
        }} onClick={onClick}>&nbsp;</div>
    );
}

export default DraggedSelectionArea;

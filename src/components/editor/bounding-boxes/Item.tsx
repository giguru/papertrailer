import React, {useRef} from 'react';
import styles from "../EditorView.module.scss";
import {ApiFileInterface} from "../../../api/models";
import {useEditorViewerContext} from "../EditorViewerContext";

function Item({ file }: { file: ApiFileInterface }) {
    const { scaler } = useEditorViewerContext();
    const imageRef = useRef();
    const initialImageWidth = file.size_width;

    // @ts-ignore
    const onLoad = ({ target: img }) => {
        imageRef.current = img;
    };

    return (
        <img
            className={styles.Image}
            src={file.file_url}
            onLoad={onLoad}
            width={initialImageWidth > 0 ? initialImageWidth * scaler : undefined}
        />
    );
}

export default Item;

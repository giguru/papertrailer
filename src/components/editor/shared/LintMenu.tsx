import React from 'react';
import {useEditorViewerContext} from "../EditorViewerContext";
import styles from './LintMenu.module.scss';
import Button from "./../../button/Button";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";

interface LintMenuProps {
    preChildren?: React.ReactNode,
    afterChildren?: React.ReactNode,
}

function LintMenu({ preChildren, afterChildren }: LintMenuProps) {
    const { scaler, setScalar, setSourcePanelOpen, sourcePanelOpen, setCommentSectionOpen, commentSectionOpen } = useEditorViewerContext();

    return (
        <div className={styles.LintMenu}>
            {preChildren}
            <div className={styles.ZoomComponent}>
                <Button onClick={() => setScalar(Math.max(scaler - 0.25, 0.25))} className={styles.ZoomButton}>
                    <ZoomOut />
                </Button>
                <div className={styles.ZoomAmount}>
                    {Math.round(scaler * 100)}%
                </div>
                <Button onClick={() => setScalar(Math.min(scaler + 0.25, 3.0))} className={styles.ZoomButton}>
                    <ZoomIn />
                </Button>
            </div>
            <div>
                <Button onClick={() => setSourcePanelOpen(!sourcePanelOpen)}>
                    Edit source
                </Button>
                <Button onClick={() => setCommentSectionOpen(!commentSectionOpen)}>
                    View comments
                </Button>
            </div>
            {afterChildren}
        </div>
    );
}

export default LintMenu;

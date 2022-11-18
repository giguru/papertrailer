import React from 'react';
import {useEditorViewerContext} from "../EditorViewerContext";
import styles from './LintMenu.module.scss';
import Button from "./../../button/Button";

interface LintMenuProps {
    preChildren?: React.ReactNode,
    afterChildren?: React.ReactNode,
}

function LintMenu({ preChildren, afterChildren }: LintMenuProps) {
    const { scaler, setScalar } = useEditorViewerContext();
    return (
        <div className={styles.LintMenu}>
            {preChildren}
            <Button onClick={() => setScalar(Math.min(scaler + 0.2, 2.0))}>Bigger</Button>
            {Math.round(scaler * 100) / 100}
            <Button onClick={() => setScalar(Math.max(scaler - 0.2, 0.1))}>Smaller</Button>
            {afterChildren}
        </div>
    );
}

export default LintMenu;

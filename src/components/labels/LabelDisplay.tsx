import React from 'react';
import {ApiLabelInterface} from "../../api/models";
import styles from './LabelDisplay.module.scss';

export const DEFAULT_LABEL_COLOR = '#dddddd';

interface LabelDisplayProps {
    label: ApiLabelInterface
}

function LabelDisplay({ label }: LabelDisplayProps) {
    return (
        <div style={{ backgroundColor: label.color || DEFAULT_LABEL_COLOR }} className={styles.LabelDisplay}>
            {label.name}
        </div>
    );
}

export default LabelDisplay;

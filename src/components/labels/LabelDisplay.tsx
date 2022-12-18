import React from 'react';
import {ApiLabelInterface} from "../../api/models";
import styles from './LabelDisplay.module.scss';


interface LabelDisplayProps {
    label: ApiLabelInterface
}

function LabelDisplay({ label }: LabelDisplayProps) {
    return (
        <div style={{ backgroundColor: label.color }} className={styles.LabelDisplay}>
            {label.name}
        </div>
    );
}

export default LabelDisplay;

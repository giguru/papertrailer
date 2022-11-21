import React from 'react';
import styles from './DividerWithText.module.scss';


function DividerWithText({ text }: { text?: string }) {
    return (
        <div className={styles.DividerWithText}>
            <span className={styles.Text}>{text}</span>
        </div>
    )
}

export default DividerWithText;

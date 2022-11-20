import React from 'react';
import styles from './DataRow.module.scss';

function DataRow({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className={styles.DataRow}>
            <label className={styles.Label}>{label}</label>
            <span>{children}</span>
        </div>
    );
}

export default DataRow;

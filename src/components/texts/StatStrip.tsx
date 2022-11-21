import React from 'react';
import styles from './StatStrip.module.scss';

function StatStrip({ elements }: { elements: React.ReactNode[] }) {
    return (
        <div className={styles.StatStrip}>
            {elements}
        </div>
    );
}

export default StatStrip;

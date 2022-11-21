import React from 'react';
import styles from './NoResults.module.scss';

function NoResults({ children } : { children: React.ReactNode }) {
    return (
        <div className={styles.NoResults}>{children}</div>
    );
}

export default NoResults;

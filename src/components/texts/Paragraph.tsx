import React from 'react';
import styles from './Paragraph.module.scss'

function Paragraph({ children }: { children: React.ReactNode }) {
    return (
        <p className={styles.Paragraph}>{children}</p>
    );
}

export default Paragraph;

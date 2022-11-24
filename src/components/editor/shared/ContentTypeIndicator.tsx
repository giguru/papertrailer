import React from 'react';
import styles from './ContentTypeIndicator.module.scss';

function ContentTypeIndicator({ children, position }: { children: string, position: 'left' | 'right' }) {
    return (
        <strong className={[styles.ContentTypeIndicator, styles[position]].join(' ')}>{children}</strong>
    );
}

export default ContentTypeIndicator;

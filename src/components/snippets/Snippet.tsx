import React, { CSSProperties } from 'react';
import styles from './Snippet.module.scss'

function Snippet({ text, className, style, onClick }: { className?: string, onClick?: () => void, text?: string, style?: CSSProperties}) {
    return (
        <div className={`${styles.Snippet} ${className}`} style={style} onClick={onClick}>
            <span className={styles.Text}>{text}</span>
            <span>{text?.length || 0} words</span>
        </div>
    );
}

export default Snippet;

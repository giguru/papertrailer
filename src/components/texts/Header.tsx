import React from 'react';
import styles from './Header.module.scss';

function Header({ text }: { text: string }) {
    return (
        <>
            <h3 className={styles.Header}>{text}</h3>
        </>
    );
}

export default Header;

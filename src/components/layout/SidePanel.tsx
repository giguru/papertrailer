import React from 'react';
import styles from './SidePanel.module.scss';
import cx from "classnames";
import Header from "../texts/Header";

function SidePanel({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cx({ [styles.SidePanel]: true, [className]: className})}>
            {children}
        </div>
    );
}

export default SidePanel;

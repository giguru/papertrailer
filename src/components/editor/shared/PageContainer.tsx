import React from 'react';
import styles from "../EditorView.module.scss";
import {PageContainerProps} from "./PageContainer.utils";

function PageContainer({ children, style }: PageContainerProps) {
    return <div className={styles.ImageContainer} style={style}>{children}</div>;
}

export default PageContainer;

import React from 'react';
import styles from "../EditorView.module.scss";
import {PageContainerProps} from "./PageContainer.utils";

function PageContainer({ children }: PageContainerProps) {
    return <div className={styles.ImageContainer}>{children}</div>;
}

export default PageContainer;

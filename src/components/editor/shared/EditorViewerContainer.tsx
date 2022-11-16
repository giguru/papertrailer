import React from 'react';
import styles from "./EditorViewerContainer.module.scss";
import LintMenu from "./LintMenu";

/**
 * The container which displays the background.
 */
function EditorViewerContainer({ children, className }: { children: React.ReactNode | React.ReactNode[], className?: string }) {
    return (
        <div className={`${styles.Viewer} ${className}`}>
            {children}
        </div>
    );
}

export default EditorViewerContainer;

import React, {useState} from 'react';
import styles from './FloatingPane.module.scss';

interface PositionInterface {
    left?: number | string,
    top: number | string,
    right?: number | string,
}

interface FloatingPaneInterface {
    children: React.ReactNode,
    position: PositionInterface,
    onClose?: Function,
    header?: string,
    className?: string,
}

function FloatingPane({ children, position, onClose, header, className }: FloatingPaneInterface) {
    const [open, setOpen] = useState(true);
    if (!open) {
        return null;
    }
    return (
        <div
            className={`${styles.FloatingPane} ${className}`}
            style={{
                left: position.left,
                right: position.right,
                top: position.top,
            }}
        >
            <span
                className={styles.CloseButton}
                onClick={() => {
                    setOpen(false);
                    if (typeof onClose === 'function') onClose();
                }}
            >
                X
            </span>
            {header && <div className={styles.Header}>{header}</div>}
            <div>
                {children}
            </div>
        </div>
    );
}

FloatingPane.Footer = ({ children }: { children: React.ReactNode }) => {
    return <div className={styles.Footer}>{children}</div>
}
FloatingPane.Content = ({ children }: { children: React.ReactNode }) => {
    return <div className={styles.Content}>{children}</div>
}

export default FloatingPane;

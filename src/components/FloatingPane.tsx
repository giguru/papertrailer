import React, {useState} from 'react';
import styles from './FloatingPane.module.scss';

interface PositionInterface {
    left: number,
    top: number,
}

interface FloatingPaneInterface {
    children: React.ReactNode,
    position: PositionInterface,
    onClose?: Function,
    header?: string,
}

function FloatingPane({ children, position, onClose, header }: FloatingPaneInterface) {
    const [open, setOpen] = useState(true);
    if (!open) {
        return null;
    }
    return (
        <div
            className={styles.FloatingPane}
            style={{
                left: position.left,
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
            <div className={styles.Content}>
                {children}
            </div>
        </div>
    );
}

export default FloatingPane;

import React, {useState} from 'react';
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import styles from './ModalBox.module.scss';

interface ModalBoxProps {
    children: React.ReactNode[] | React.ReactNode,
    onClose: () => void,
    header: string | React.ReactNode,
    footer?: React.ReactNode
}

function ModalBox({header, footer, children, onClose }: ModalBoxProps) {
    return (
        <Modal
            open
            onClose={onClose}
        >
            <div className={styles.Container}>
                <Box className={styles.ModalBox}>
                    <div className={styles.Header}>
                        {header}
                    </div>
                    <div className={styles.Content}>
                        {children}
                    </div>
                    <footer>
                        {footer}
                    </footer>
                </Box>
            </div>
        </Modal>
    );
}

function ModalBoxViaButton({header, children, footer, onClose, buttonText}: { buttonText: string } & Partial<ModalBoxProps>) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="contained">{buttonText}</Button>
            {open && (
                <ModalBox
                    onClose={() => {
                        setOpen(false)
                        if (onClose) onClose();
                    }}
                    header={header}
                    footer={footer}
                >
                    {children}
                </ModalBox>
            )}
        </>
    )
}

ModalBox.ViaButton = ModalBoxViaButton

export default ModalBox;

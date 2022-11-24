import React, {useState} from 'react';
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import styles from './ModalBox.module.scss';
import {ButtonProps as MuiButtonProps} from "@mui/material/Button/Button";

interface ModalBoxProps {
    children: React.ReactNode[] | React.ReactNode,
    onClose: () => void,
    header: string | React.ReactNode,
    footer?: React.ReactNode,
    size: 'xs' | 'sm' | 'md',
}

function ModalBox({header, footer, children, onClose, size }: ModalBoxProps) {
    return (
        <Modal
            open
            onClose={onClose}
        >
            <div className={styles.Container}>
                <Box className={[styles.ModalBox, size].join(' ')}>
                    <div className={styles.Header}>
                        {header}
                    </div>
                    <div className={styles.Content}>
                        {children}
                    </div>
                    <footer className={styles.Footer}>
                        {footer}
                    </footer>
                </Box>
            </div>
        </Modal>
    );
}

type ModalBoxViaButtonProps = {
    buttonText: string,
    closeButtonText?: string,
} & Partial<ModalBoxProps> & Pick<MuiButtonProps, 'variant' | 'color'>

function ModalBoxViaButton({header, children, footer, onClose, buttonText, variant, color, closeButtonText }: ModalBoxViaButtonProps) {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={variant || 'contained'}
                color={color || 'primary'}
            >
                {buttonText}
            </Button>
            {open && (
                <ModalBox
                    onClose={() => {
                        close()
                        if (onClose) onClose();
                    }}
                    size="xs"
                    header={header}
                    footer={(
                        <>
                            {closeButtonText && <Button onClick={close} variant="outlined" color="info">{closeButtonText}</Button>}
                            {footer}
                        </>
                    )}
                >
                    {children}
                </ModalBox>
            )}
        </>
    )
}

ModalBox.ViaButton = ModalBoxViaButton

export default ModalBox;

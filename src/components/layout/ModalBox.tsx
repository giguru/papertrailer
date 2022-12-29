import React, {MouseEventHandler, useState} from 'react';
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import styles from './ModalBox.module.scss';
import {ButtonProps as MuiButtonProps} from "@mui/material/Button/Button";
import {Close} from "@mui/icons-material";
import ErrorBoundary from "../ErrorBoundary";

interface ModalBoxProps {
    children: React.ReactNode[] | React.ReactNode,
    onClose: () => void,
    onClick?: MouseEventHandler<HTMLDivElement>,
    header: string | React.ReactNode,
    footer?: React.ReactNode,
    size: 'xs' | 'sm' | 'md',
}

function ModalBox({header, footer, children, onClose, size, onClick }: ModalBoxProps) {
    return (
        <Modal
            open
            onClose={onClose}
        >
            <div className={styles.Container} onClick={onClick}>
                <Box className={[styles.ModalBox, size].join(' ')}>
                    <div className={styles.Header}>
                        <div>{header}</div>
                        <Close onClick={onClose} />
                    </div>
                    <div className={styles.Content}>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </div>
                    <footer className={styles.Footer}>
                        <ErrorBoundary>{footer}</ErrorBoundary>
                    </footer>
                </Box>
            </div>
        </Modal>
    );
}

type ModalBoxViaButtonProps = {
    buttonText: string,
    closeButtonText?: string,
    buttonClassName?: string,
} & Partial<Omit<ModalBoxProps, 'size'>> & Pick<MuiButtonProps, 'variant' | 'color' | 'size'>

function ModalBoxViaButton({header, children, footer, onClose, buttonText, variant, color, closeButtonText, size, buttonClassName }: ModalBoxViaButtonProps) {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false);

    return (
        <span onClick={(e) => {
            e.stopPropagation();
        }}>
            <Button
                onClick={(e) => {
                    setOpen(true);
                    e.stopPropagation();
                }}
                variant={variant || 'contained'}
                color={color || 'primary'}
                size={size || 'medium'}
                className={buttonClassName}
            >
                {buttonText}
            </Button>
            {open && (
                <ModalBox
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
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
        </span>
    )
}

ModalBox.ViaButton = ModalBoxViaButton

export default ModalBox;

import React from 'react';
import MuiButton from "@mui/material/Button";
import { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import Loader from "../loader/Loader";

type ButtonInterface = Pick<MuiButtonProps, 'children' | 'onClick' | 'variant' | 'type' | 'className' | 'size' | 'color'> & {
    isBusy?: boolean
};

function Button({ children, variant = 'outlined', onClick = undefined, type, className, isBusy, size, color }: ButtonInterface) {
    return (
        <MuiButton onClick={onClick} variant={variant} type={type} className={className} disabled={isBusy} size={size} color={color}>
            {children}
            {isBusy && <Loader size="inline" />}
        </MuiButton>
    );
}

export default Button;

import React from 'react';
import MuiButton from "@mui/material/Button";
import { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonInterface = Pick<MuiButtonProps, 'children' | 'onClick' | 'variant' | 'type'>;

function Button({ children, variant = 'outlined', onClick = undefined, type }: ButtonInterface) {
    return (
        <MuiButton onClick={onClick} variant={variant} type={type}>
            {children}
        </MuiButton>
    );
}

export default Button;

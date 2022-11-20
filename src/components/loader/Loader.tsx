import React from 'react';
import { CircularProgress } from "@mui/material";

interface LoaderProps {
    size?: 'inline'
}

function Loader({size}: LoaderProps) {
    return (
        <CircularProgress size={size === 'inline' ? 20 : undefined}/>
    );
}

export default Loader;

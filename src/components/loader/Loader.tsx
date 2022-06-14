import React from 'react';
import { CircularProgress } from "@mui/material";

interface LoaderProps {

}

function Loader(props: LoaderProps) {
    return (
        <CircularProgress />
    );
}

export default Loader;

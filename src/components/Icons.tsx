import {Extension} from "@mui/icons-material";
import React from "react";
import styles from './Icons.module.scss';
import Tooltip from "@mui/material/Tooltip";


const Icons: Record<string, () => JSX.Element> = {
    AddedViaExtension: () => <Tooltip title="Imported via Browser Extension" className={styles.Icon}><Extension fontSize="inherit" /></Tooltip>,
};

export default Icons;

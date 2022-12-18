import React from 'react';
import {AlertProps} from "@mui/material";
import Alert from "@mui/material/Alert";
import styles from './LocalAlert.module.scss';

function LocalAlert(props : AlertProps) {
    return (
        <span className={styles.Positioner}>
            <Alert {...props} className={styles.Alert} />
        </span>
    );
}

export default LocalAlert;

import React, {useState} from 'react';
import axios from 'axios';
import _ from 'lodash';
import Alert from '@mui/material/Alert';
import Button from "../button/Button";
import ModalBox from "../layout/ModalBox";
import Paragraph from "../texts/Paragraph";
import {ServerErrorResponse} from "../../api/api";
import {ButtonProps} from "@mui/material";

interface DeleteButtonProps {
    endpoint: string
    onSuccess: () => void
    verbString?: string
    size?: ButtonProps['size']
}

function DeleteButton({ endpoint, onSuccess, verbString = 'delete', size }: DeleteButtonProps) {
    const [isDeleting, setDeleting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const doDelete = () => {
        setDeleting(true);

        axios.delete<ServerErrorResponse<{}>>(endpoint)
            .then(() => {
                onSuccess()
            })
            .catch((e) => {
                setSubmitError(e?.response?.data?.message || e.message);
            })
            .finally(() => {
                setDeleting(false)
            });
    };

    return (
        <ModalBox.ViaButton
            buttonText={_.startCase(verbString)}
            header={_.startCase(verbString)}
            color="error"
            variant="outlined"
            size={size}
        >
            <Paragraph>Are you sure you want to {verbString} it?</Paragraph>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <Button
                variant="contained"
                color="error"
                onClick={doDelete}
                isBusy={isDeleting}
            >
                Yes, {verbString}
            </Button>
        </ModalBox.ViaButton>
    );
}

export default DeleteButton;

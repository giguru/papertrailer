import React, {useState} from 'react';
import Button from "../button/Button";
import axios, {AxiosError, AxiosResponse} from "axios";
import ModalBox from "../layout/ModalBox";
import Paragraph from "../texts/Paragraph";
import Alert from "@mui/material/Alert";
import {ServerErrorResponse} from "../../api/api";

function DeleteButton({ endpoint, onSuccess }: { endpoint: string, onSuccess: () => void }) {
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
            buttonText="Delete"
            header="Delete"
            size="xs"
            color="error"
            variant="outlined"
        >
            <Paragraph>Are you sure you want to delete it?</Paragraph>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <Button
                variant="contained"
                color="error"
                onClick={doDelete}
                isBusy={isDeleting}
            >
                Yes, delete
            </Button>
        </ModalBox.ViaButton>
    );
}

export default DeleteButton;

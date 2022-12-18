import React from 'react';
import axios from 'axios';
import {Formik} from "formik";
import styles from "./NewLabelForm.module.scss";
import TextInput from "../forms/TextInput";
import {Select} from "../forms";
import Button from "../button/Button";
import {ApiLabelInterface} from "../../api/models";
import ColorPicker from "../forms/ColorPicker";
import {SaveButton} from "../forms/Form";

function NewLabelForm({ labels, userId, onSuccess } : { userId?: number, labels?: ApiLabelInterface[], onSuccess: () => void }) {
    return (
        <Formik
            initialValues={{
                name: '',
                parent_id: '',
                color: '#ddd',
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                axios
                    .post('/labels', {
                        ...values,
                        user_id: userId
                    })
                    .then(() => {
                        onSuccess();
                        resetForm();
                    })
                    .finally(() => {
                        setSubmitting(false);
                    })
            }}
        >
            {({ handleSubmit, setFieldValue, values }) => (
                <form onSubmit={handleSubmit} className={styles.Form}>
                    <ColorPicker.Formik name="color" />
                    <TextInput.Formik name="name" label="New label name" />
                    <Select.Formik
                        label="Parent label"
                        name="parent_id"
                        options={labels?.map((label ) => (
                            { value: `${label.id}`, label: label.name }
                        )) || []}
                    />
                    <SaveButton />
                </form>
            )}
        </Formik>
    );
}

export default NewLabelForm;

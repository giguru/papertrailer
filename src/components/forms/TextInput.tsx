import React from 'react';
import { useField } from 'formik'
import {FieldInputProps} from "formik/dist/types";
import {TextField} from "@mui/material";
import styles from './TextInput.module.scss';

interface TextInputFieldInterface {
    name: string;
    placeholder?: string,
    multiline?: boolean,
    label?: string,
}

function TextInputField({ name, placeholder, multiline, label }: TextInputFieldInterface) {
    const [field, { error }] = useField({ name })
    return (
        <TextInput
            {...field}
            placeholder={placeholder}
            multiline={multiline}
            label={label}
            error={error}
        />
    );
}

interface TextInputInterface extends Omit<FieldInputProps<any>, 'name' | 'onChange' | 'onBlur'> {
    placeholder?: string,
    autoFocus?: boolean,
    multiline?: boolean,
    label?: string,
    error?: string,
    name?: FieldInputProps<any>['name']
    onChange?: FieldInputProps<any>['onChange']
    onBlur?: FieldInputProps<any>['onBlur']
}

function TextInput({ name, value, onChange, onBlur, placeholder, autoFocus = false, multiline, label, error }: TextInputInterface) {
    return (
        <TextField
            className={styles.TextInput}
            placeholder={placeholder}
            variant="outlined"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoFocus={autoFocus}
            multiline={multiline}
            helperText={error}
            margin="normal"
            label={label}
            fullWidth
            minRows={4}
        />
    );
}
TextInput.Formik = TextInputField;

export default TextInput;

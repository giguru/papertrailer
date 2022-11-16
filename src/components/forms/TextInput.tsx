import React from 'react';
import { useField } from 'formik'
import {FieldInputProps} from "formik/dist/types";
import {TextField} from "@mui/material";
import styles from './TextInput.module.scss';


interface TextInputFieldInterface {
    name: string;
    placeholder?: string,
}

function TextInputField({ name, placeholder }: TextInputFieldInterface) {
    const [field] = useField({ name })
    return (
        <TextInput
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
        />
    );
}

interface TextInputInterface extends FieldInputProps<any> {
    placeholder?: string,
    autoFocus?: boolean,
}

function TextInput({ name, value, onChange, onBlur, placeholder, autoFocus = false }: TextInputInterface) {
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
        />
    );
}
TextInput.Formik = TextInputField;

export default TextInput;

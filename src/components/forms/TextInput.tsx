import React from 'react';
import { useField } from 'formik'
import {FieldInputProps} from "formik/dist/types";

interface TextInputFieldInterface {
    name: string;
}

function TextInputField({ name }: TextInputFieldInterface) {
    const [field] = useField({ name })
    return (
        <TextInput
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
        />
    );
}

interface TextInputInterface extends FieldInputProps<any> {
}

function TextInput({ name, value, onChange, onBlur }: TextInputInterface) {
    return (
        <input
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}
TextInput.Formik = TextInputField;

export default TextInput;

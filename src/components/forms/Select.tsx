import React, {useId, useMemo} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MuiSelect from '@mui/material/Select';
import {groupByOptionGroup, OptionInterface} from "./utils";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useField} from "formik";

interface SelectProps {
    label: string,
    name: string,
    options: OptionInterface[],
    defaultValue?: string,
    value?: string,
    onChange?(event: SelectChangeEvent<string>, child: React.ReactNode): void,
}

const optionRenderer = ({ value, label }: { value: string, label: string }) => (
    <option key={value} value={value}>{label}</option>
);

function Select({ label, options, defaultValue = "", onChange, value, name }: SelectProps) {
    const id = useId();
    const optionGroups = useMemo(() => {
        return groupByOptionGroup(options);
    }, [options])

    return (
        <FormControl fullWidth>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <MuiSelect
                defaultValue={defaultValue}
                value={value}
                id={id}
                label={label}
                onChange={onChange}
                name={name}
                native
            >
                <option aria-label="None" value=""/>
                {optionGroups
                    ? Object.keys(optionGroups).map(label => (
                        <optgroup key={label} label={label}>
                            {optionGroups[label].map(optionRenderer)}
                        </optgroup>
                    ))
                    : // Simply list all options
                    options.map(optionRenderer)}
            </MuiSelect>
        </FormControl>
    );
}

function SelectForm({ label, options, name }: SelectProps) {
    const [field,, helpers] = useField(name);
    return (
        <Select
            label={label}
            options={options}
            name={name}
            value={field.value}
            onChange={(e) => helpers.setValue(e.target.value)}
        />
    );
}
Select.Formik = SelectForm;

export default Select;

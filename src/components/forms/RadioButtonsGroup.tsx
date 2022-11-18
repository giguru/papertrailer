import React, {useId, useMemo} from 'react';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {useField} from "formik";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {groupByOptionGroup, OptionInterface} from "./utils";
import styles from './RadioButtonsGroup.module.scss';


type ValueType = string;

interface RadioButtonsGroupInterface<T = OptionInterface> {
    options: T[],
    name: string,
    label: string,
    onChange(e: React.ChangeEvent<HTMLInputElement>) : void,
    value?: ValueType,
}

const optionRenderer = ({ value, label, color }: { value: ValueType, label: string, color?: string }) => (
    <FormControlLabel
        value={value}
        key={value}
        control={<Radio />}
        label={<span style={{ borderBottomColor: color }} className={styles.OptionLabel}>{label}</span>}
    />
);

function RadioButtonsGroupField({ name, options, label }: Omit<RadioButtonsGroupInterface, 'onChange' | 'value'>) {
    const [field, , helpers] = useField(name);
    return (
        <RadioButtonsGroup
            name={name}
            options={options}
            label={label}
            value={field.value}
            onChange={(e) => {
                helpers.setValue(e.target.value)
            }}
        />
    );
}

function RadioButtonsGroup({ options, name, label, onChange, value = '' }: RadioButtonsGroupInterface) {
    const id = useId();

    const optionGroups = useMemo(() => {
        return groupByOptionGroup(options);
    }, [options])

    return (
        <FormControl>
            <FormLabel id={id}>{label}</FormLabel>
            <RadioGroup
                aria-labelledby={id}
                defaultValue={options[0].value}
                name={name}
                onChange={onChange}
                value={value}
            >
            {optionGroups
                ? Object.keys(optionGroups).map(label => (
                    <span key={label} className={styles.OptionGroup}>
                        <FormLabel className={styles.GroupLabel}>{label}</FormLabel>
                        <div>
                            {optionGroups[label].map(optionRenderer)}
                        </div>
                    </span>
                ))
                : // Simply list all options
                options.map(optionRenderer)}
            </RadioGroup>

        </FormControl>
    );
}
RadioButtonsGroup.Formik = RadioButtonsGroupField;

export default RadioButtonsGroup;

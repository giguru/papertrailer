import React, {useId, useMemo} from 'react';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {useField} from "formik";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {groupByOptionGroup, OptionInterface} from "./utils";
import styles from './RadioButtonsGroup.module.scss';
import {FormHelperText} from "@mui/material";


type ValueType = string;

interface RadioButtonsGroupInterface<T = OptionInterface> {
    options: T[],
    name: string,
    label: string,
    onChange(e: React.ChangeEvent<HTMLInputElement>) : void,
    value?: ValueType,
    inlineOptions?: boolean,
    helperText?: string,
}

const optionRenderer = ({ value, label, color, inline }: { value: ValueType, label: string, color?: string, inline: boolean }) => (
    <FormControlLabel
        value={value}
        key={value}
        control={<Radio />}
        className={[inline ? styles.Inline : ''].join(' ')}
        label={(
            <span
                style={{ borderBottomColor: color || undefined, borderBottomWidth: color ? '3px' : undefined }}
                className={styles.OptionLabel}
            >
                {label}
            </span>
        )}
    />
);

function RadioButtonsGroupField({ name, options, label, inlineOptions }: Omit<RadioButtonsGroupInterface, 'onChange' | 'value'>) {
    const [field, , helpers] = useField(name);
    return (
        <RadioButtonsGroup
            name={name}
            options={options}
            label={label}
            value={field.value}
            inlineOptions={inlineOptions}
            onChange={(e) => {
                helpers.setValue(e.target.value)
            }}
        />
    );
}

function RadioButtonsGroup({ options, name, label, onChange, value = '', inlineOptions = false, helperText = '' }: RadioButtonsGroupInterface) {
    const id = useId();

    const optionGroups = useMemo(() => {
        return groupByOptionGroup(options);
    }, [options])

    return (
        <FormControl>
            <FormLabel id={id}>{label}</FormLabel>
            {helperText && <FormHelperText className="ml-0 pl-0">{helperText}</FormHelperText>}
            <RadioGroup
                aria-labelledby={id}
                defaultValue={options[0].value}
                name={name}
                onChange={onChange}
                value={value}
                className={inlineOptions ? styles.InlineRadioGroup : undefined}
            >
            {optionGroups
                ? Object.keys(optionGroups).map(label => (
                    <span key={label} className={styles.OptionGroup}>
                        <FormLabel className={styles.GroupLabel}>{label}</FormLabel>
                        <div>
                            {optionGroups[label].map(o => optionRenderer({...o, inline: inlineOptions }))}
                        </div>
                    </span>
                ))
                : // Simply list all options
                options.map(o => optionRenderer({ ...o, inline: inlineOptions }))}
            </RadioGroup>
        </FormControl>
    );
}
RadioButtonsGroup.Formik = RadioButtonsGroupField;

export default RadioButtonsGroup;

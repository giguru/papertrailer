import React, {useId, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MuiSelect from '@mui/material/Select';
import {OptionInterface} from "./utils";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useField} from "formik";
import Box from "@mui/material/Box";
import {Chip} from "@mui/material";
import _ from 'lodash';
import MenuItem from "@mui/material/MenuItem";
import styles from "./ItemPicker.module.scss";


const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 4;

type ValueType = string[]
interface SelectProps {
    label: string,
    name: string,
    options: OptionInterface[],
    defaultValue?: ValueType,
    value: ValueType,
    floating?: boolean,
    onChange?(event: { target: { value?: ValueType, name: string } } | SelectChangeEvent<ValueType>): void,
}

const optionRenderer = ({ value, label, selected }: { value: string, label: string, selected: boolean }) => (
    <MenuItem key={value} value={value} style={selected ? { fontWeight: 'bold' }: undefined}>{label}</MenuItem>
);

function ItemPicker({ label, options, onChange, value, name, floating = true }: SelectProps) {
    const id = useId();
    const [open, setOpen] = useState(false);

    const maxHeight = ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP;

    return (
        <FormControl fullWidth>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <MuiSelect
                value={value}
                id={id}
                multiple
                label={label}
                onChange={onChange}
                name={name}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                            const option = options.find(o => `${o.value}` === `${value}`);
                            return option && (
                                <Chip
                                    key={value}
                                    label={option?.label}
                                    style={{ backgroundColor: option?.color }}
                                    component={(props) => (
                                        <div{...props}>
                                            {props.children}
                                        </div>
                                    )}
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight,
                            width: 250,
                        },
                    }
                }}
            >
                {options.map((o) => optionRenderer({...o, selected: value.indexOf(`${o.value}`) > -1 }))}
            </MuiSelect>
            <div className={styles.Placeholder} style={{ height: open && floating === false ? maxHeight: 0 }} />
        </FormControl>
    );
}

function ItemPickerForm({ label, options, name, floating = true }: Omit<SelectProps, 'value' | 'defaultValue' | 'onChange'>) {
    const [field,, helpers] = useField(name);
    const current = Array.isArray(field.value)
        // @ts-ignore
        ? field.value.map(objOrNumber => `${_.isObject(objOrNumber) ? objOrNumber?.id : objOrNumber}`).filter(v => v && v != 'undefined')
        : [];

    return (
        <ItemPicker
            label={label}
            options={options}
            name={name}
            value={current}
            floating={floating}
            onChange={(e) => {
                if (e.target.value) {
                    helpers.setValue(e.target.value)
                }
            }}
        />
    );
}
ItemPicker.Formik = ItemPickerForm;

export default ItemPicker;

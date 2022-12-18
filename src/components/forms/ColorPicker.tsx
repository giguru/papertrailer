import {useField} from "formik";
import React, {useState} from "react";
import {ColorResult, SwatchesPicker} from "react-color";
import styles from './ColorPicker.module.scss';


function ColorPickerFormik({ name }: { name: string }) {
    const [field, , helpers] = useField(name);


    return (
        <ColorPicker
            value={field.value}
            onSelect={(color) => {
                helpers.setValue(color);
            }}
        />
    )
}

function ColorPicker({ onSelect, value }: { onSelect?: (color: ColorResult['hex']) => void, value: string }) {
    const [open, setOpen] = useState(false);

    return (
        <span className={styles.Container}>
            {open && (
                <SwatchesPicker
                    className={styles.Picker}
                    onChange={(color) => {
                        if (onSelect) onSelect(color.hex)
                        setOpen(false);
                    }}
                    color={value}
                />
            )}
            <div
                style={{ backgroundColor: value }}
                className={styles.Preview}
                onClick={!onSelect ? undefined : () => setOpen(true)}
            />
        </span>
    )
}

ColorPicker.Formik =  ColorPickerFormik

export default ColorPicker;

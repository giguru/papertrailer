import {useEffect, useState} from "react";


export default function useLocalStorage({ key, format = 'string' }) {
    const parseValue = (v) => {
        if (format === 'json') {
            return v ? JSON.parse(v) : undefined
        }
        return v
    }

    const codifyValue = (v) => {
        if (format === 'json') {
            return v ? JSON.stringify(v) : ''
        }
        return v
    }

    const [value, setValue] = useState(parseValue(localStorage.getItem(key)))

    const setLocalValue = (value) => {
        localStorage.setItem(key, codifyValue(value));
    }

    useEffect(() => {
        const listener = () => {
            setValue(parseValue(localStorage.getItem(key)))
        }

        window.addEventListener('storage', listener);
        return () => {
            window.removeEventListener('storage', listener);
        }
    }, [])

    return {
        value,
        setLocalValue
    }
}

import {useEffect, useRef, useState} from "react";


export function useTimeout({ time = 1000 }) {
    const timeoutRef = useRef<NodeJS.Timeout>();

    const doTimeout = (func: () => void) => {
        clearTimeout(timeoutRef.current)

        // Clear automatically after some time
        timeoutRef.current = setTimeout(() => {
            func();
        }, time)
    }

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return {
        doTimeout,
    }
}

import {useEffect, useRef, useState} from "react";


export function useDisappearingFeedback() {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [feedback, setFeedbackState] = useState<string>('');

    const setFeedback = (content: string) => {
        clearTimeout(timeoutRef.current)
        setFeedbackState(content)

        // Clear automatically after some time
        timeoutRef.current = setTimeout(() => {
            setFeedbackState('');
        }, 3000)
    }

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return {
        feedback,
        setFeedback,
    }
}

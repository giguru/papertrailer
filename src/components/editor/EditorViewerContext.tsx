import React, {useContext, useEffect, useId, useState} from 'react';
import { AnySelection } from "./EditorViewer.utils";
import {useEditorContext} from "./EditorContext";

interface EditorViewerContextProps {
    scaler: number,
    setScalar: (scale: number) => void,
    setSelectedContent: (selection: AnySelection) => void,
    selectedContent: AnySelection | undefined,
    clearSelectedContent: () => void,
}
export const initialState : EditorViewerContextProps = {
    scaler: 1,
    setScalar: () => {},
    setSelectedContent: console.error,
    selectedContent: undefined,
    clearSelectedContent: () => {},
}

const EditorViewerContext = React.createContext<EditorViewerContextProps>(initialState);

export function useEditorViewerContext() {
    const context = useContext<EditorViewerContextProps>(EditorViewerContext);
    return { ...context }
}


export function EditorViewerContextProvider({ children, id }: { children: React.ReactNode, id: string }) {
    const [scaler, setScalar] = useState<number>(initialState.scaler);
    const { setSelectedBoundingBoxes, selectedBoundingBoxesPerEditor } = useEditorContext()

    const clearSelectedContent = () => setSelectedBoundingBoxes(id,undefined);
    useEffect(() => {
        setSelectedBoundingBoxes(id, undefined)
        return () => {
            clearSelectedContent();
        }
    }, [])

    return (
        <EditorViewerContext.Provider
            value={{
                scaler,
                setScalar,
                selectedContent: selectedBoundingBoxesPerEditor[id],
                setSelectedContent: (s: AnySelection) => {
                    setSelectedBoundingBoxes(id, s)
                },
                clearSelectedContent,
            }}
        >
            {children}
        </EditorViewerContext.Provider>
    );
}

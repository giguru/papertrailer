import React, {useContext, useEffect, useId, useState} from 'react';
import { AnySelection } from "./EditorViewer.utils";
import {useEditorContext} from "./EditorContext";
import {ApiFileInterface} from "../../api/models";

interface EditorViewerContextProps {
    scaler: number,
    setScalar: (scale: number) => void,
    setSelectedContent: (selection: AnySelection) => void,
    selectedContent?: AnySelection,
    clearSelectedContent: () => void,
    file?: ApiFileInterface,
    setFile: (file: ApiFileInterface | undefined) => void,
}
export const initialState : EditorViewerContextProps = {
    scaler: 1,
    setScalar: () => {},
    setSelectedContent: console.error,
    selectedContent: undefined,
    clearSelectedContent: () => {},
    file: undefined,
    setFile: () => {},
}

const EditorViewerContext = React.createContext<EditorViewerContextProps>(initialState);

export function useEditorViewerContext() {
    const context = useContext<EditorViewerContextProps>(EditorViewerContext);
    return { ...context }
}


export function EditorViewerContextProvider({ children, id }: { children: React.ReactNode, id: string }) {
    const [scaler, setScalar] = useState<number>(initialState.scaler);
    const [file, setFile] = useState<ApiFileInterface | undefined>()
    const { setSelectedBoundingBoxes, selectedBoundingBoxesPerEditor } = useEditorContext()

    const clearSelectedContent = () => setSelectedBoundingBoxes(id,undefined);
    useEffect(() => {
        return () => {
            // Clear selection upload unmounting
            clearSelectedContent();
        }
    }, [])

    return (
        <EditorViewerContext.Provider
            value={{
                scaler,
                setScalar,
                selectedContent: selectedBoundingBoxesPerEditor[id] || undefined,
                setSelectedContent: (s: AnySelection) => {
                    setSelectedBoundingBoxes(id, s)
                },
                clearSelectedContent,
                file,
                setFile,
            }}
        >
            {children}
        </EditorViewerContext.Provider>
    );
}

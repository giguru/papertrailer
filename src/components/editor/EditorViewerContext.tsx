import React, {useContext, useEffect, useId, useState} from 'react';
import { AnySelection } from "./EditorViewer.utils";
import {useEditorContext} from "./EditorContext";
import {ApiFileInterface, ApiRelationInterface} from "../../api/models";

interface EditorViewerContextProps {
    scaler: number,
    setScalar: (scale: number) => void,
    setSelectedContent: (selection: AnySelection) => void,
    selectedContent?: AnySelection,
    clearSelectedContent: () => void,
    file?: ApiFileInterface,
    setFile: (file: ApiFileInterface | undefined) => void,
    relations?: ApiRelationInterface[],
    setRelations: (relations: ApiRelationInterface[]) => void,
    sourcePanelOpen: boolean,
    setSourcePanelOpen: (isOpen: boolean) => void
}
export const initialState : EditorViewerContextProps = {
    scaler: 1,
    setScalar: () => {},
    setSelectedContent: console.error,
    selectedContent: undefined,
    clearSelectedContent: () => {},
    file: undefined,
    setFile: () => {},
    relations: undefined,
    setRelations: () => {},
    sourcePanelOpen: false,
    setSourcePanelOpen: () => {},
}

const EditorViewerContext = React.createContext<EditorViewerContextProps>(initialState);

export function useEditorViewerContext() {
    const context = useContext<EditorViewerContextProps>(EditorViewerContext);
    return { ...context }
}


export function EditorViewerContextProvider({ children, id }: { children: React.ReactNode, id: string }) {
    const [scaler, setScalar] = useState<number>(initialState.scaler);
    const [file, setFile] = useState<ApiFileInterface | undefined>()
    const [relations, setRelations] = useState<ApiRelationInterface[] | undefined>()
    const { setSelectedBoundingBoxes, selectedBoundingBoxesPerEditor } = useEditorContext()
    const [sourcePanelOpen, setSourcePanelOpen] = useState<EditorViewerContextProps['sourcePanelOpen']>(false);

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
                relations,
                setRelations,
                sourcePanelOpen,
                setSourcePanelOpen,
            }}
        >
            {children}
        </EditorViewerContext.Provider>
    );
}

import React, {useContext, useState} from 'react';
import {AnySelection, ExtendedBoundingBlock} from "./EditorViewer.utils";
import {RelationValue} from "../../utils/enums";

export interface FlowData {
    relation?: RelationValue,
}

interface EditorContextProps {
    selectedBoundingBoxesPerEditor: {
        [k: string]: AnySelection | undefined
    },
    setSelectedBoundingBoxes(editorId: string, selection: AnySelection | undefined): void,
    flowData: FlowData,
    addFlowData(data: FlowData) : void
}

const EditorContext = React.createContext<EditorContextProps>({
    selectedBoundingBoxesPerEditor: {},
    setSelectedBoundingBoxes: () => {},
    flowData: {},
    addFlowData: (data) => {}
});

export function useEditorContext(): EditorContextProps {
    return useContext(EditorContext);
}

export function EditorContextProvider({ children }: { children: React.ReactNode}) {
    const [selectedBoundingBoxesPerEditor, setSelectedBoundingBoxesPerEditor] = useState({});
    const [flowData, setFlowData] = useState<FlowData>({});

    const setSelectedBoundingBoxes = (editorId: string, selection: AnySelection) => {
        setSelectedBoundingBoxesPerEditor({
            ...selectedBoundingBoxesPerEditor,
            [editorId]: selection,
        });
    }

    return (
        <EditorContext.Provider
            value={{
                selectedBoundingBoxesPerEditor,
                setSelectedBoundingBoxes,
                flowData,
                addFlowData: (newData : FlowData) => setFlowData({...flowData, ...newData}),
            }}
        >
            {children}
        </EditorContext.Provider>
    )
}


export default EditorContext;

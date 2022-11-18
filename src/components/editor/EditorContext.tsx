import React, {useContext, useRef, useState} from 'react';
import {AnySelection, BoundingBlock} from "./EditorViewer.utils";
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
    const ref = useRef<EditorContextProps['selectedBoundingBoxesPerEditor']>({});
    const [refStateValue, setRefStateValue] = useState<EditorContextProps['selectedBoundingBoxesPerEditor']>({});
    const [flowData, setFlowData] = useState<FlowData>({});

    const setSelectedBoundingBoxes = (editorId: string, selection: AnySelection | undefined) => {
        // Use refs, because this method can be called multiple times within microseconds. If you use a state, all calls
        // will use the same old state value, resulting in only ONE successful call.
        if (selection) {
            ref.current[editorId] = selection;
        } else if (ref.current.hasOwnProperty(editorId)) {
            delete ref.current[editorId];
        }
        // Create copy otherwise the object reference ID is the same, thus not triggering an update.
        setRefStateValue({ ...ref.current })
    }

    return (
        <EditorContext.Provider
            value={{
                selectedBoundingBoxesPerEditor: refStateValue,
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

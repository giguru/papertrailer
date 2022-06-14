import React, { useState } from 'react';

interface EditorContextInterface {
    scaler: number,
    setScalar: Function,
}
const initialState : EditorContextInterface = {
    scaler: 0.5,
    setScalar: () => {},
}

const EditorContext = React.createContext<EditorContextInterface>(initialState);

export default EditorContext;

export function EditorContextProvider({ children }: { children: React.ReactNode }) {
    const [scaler, setScalar] = useState<number>(initialState.scaler);
    return (
        <EditorContext.Provider
            value={{
                scaler,
                setScalar,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

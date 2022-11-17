import React, { useContext } from 'react';
import {AnySelection} from "../editor/EditorViewer.utils";
import useLocalStorage from "../useLocalStorage";

type Snippet = AnySelection

interface SnippetContextProps {
    snippets: Snippet[]
    addSnippet: (snippet: Snippet) => void
}

const SnippetContext = React.createContext<SnippetContextProps>({
    snippets: [],
    addSnippet: () => {}
})
export function useSnippetsContext() {
    const context = useContext(SnippetContext)
    return { ...context };
}

function SnippetProvider({ children }: {children: React.ReactNode}) {
    const { value, setLocalValue } = useLocalStorage({ key: 'snippets', format: 'json' });
    const snippets = Array.isArray(value) ? value : []
    const addSnippet = (snippet: AnySelection) => {
        setLocalValue(snippets.concat([snippet]));
    }

    return (
        <SnippetContext.Provider
            value={{
                snippets,
                addSnippet,
            }}
        >
            {children}
        </SnippetContext.Provider>
    );
}

export default SnippetProvider;

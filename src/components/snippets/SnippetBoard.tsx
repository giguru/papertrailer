import React from 'react';
import {useSnippetsContext} from "./SnippetProvider";
import Snippet from "./Snippet";

function SnippetBoard({}) {
    const { snippets } = useSnippetsContext();
    return (
        <>
            {snippets.map((snippet) => <Snippet text={snippet.text} />)}
        </>
    );
}

export default SnippetBoard;

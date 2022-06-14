import React from 'react';
import {EditorContextProvider} from "../components/editor/EditorContext";
import LintMenu from "../components/editor/LintMenu";
import EditorViewer from "../components/editor/EditorViewer";

function Editor() {
    return (
        <EditorContextProvider>
            <LintMenu />
            <EditorViewer />
        </EditorContextProvider>
    );
}

export default Editor;

import React from 'react';
import SearchInput from "../../components/search-input/SearchInput";
import styles from './SearchDocumentView.module.scss';
import Button from "../../components/button/Button";
import {useSnippetsContext} from "../../components/snippets/SnippetProvider";
import Snippet from "../../components/snippets/Snippet";
import {AnySelection} from "../../components/editor/EditorViewer.utils";
import DividerWithText from "../../components/DividerWithText";

function SearchDocumentView<T extends Record<string, any>>(
    {
        onSelect,
        selection,
        close
    }: {
        onSelect: ({ id }: { id: number }, selection?: AnySelection) => void,
        selection?: AnySelection,
        close: () => void
    }
) {
    const { addSnippet, snippets } = useSnippetsContext()

    return (
        <div className={styles.SearchDocumentView}>
            <div className={styles.InnerView}>
                {selection && <Snippet text={selection.text} />}
                <h4>Link to document in your library</h4>
                <SearchInput<T>
                    placeholder="Search..."
                    onSelect={onSelect}
                    endpoint="search"
                />

                <DividerWithText text="OR" />
                <h4>Link to another snippet</h4>
                {snippets.length
                    ? snippets.map((s, sIndex) => <Snippet key={sIndex} onClick={() => onSelect({ id: s.fileId }, s)} text={s.text} />)
                    : <p>No snippets on Snippet board</p>}

                {selection && (
                    <>
                        <DividerWithText text="OR" />

                        <p>Put it op your <b>Snippet board</b> to link later.</p>
                        <Button
                            onClick={() => {
                                addSnippet(selection);
                                close();
                            }}
                        >
                            Onto Snippet board
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchDocumentView;

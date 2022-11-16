import React from 'react';
import SearchInput from "../../components/search-input/SearchInput";
import styles from './SearchDocumentView.module.scss';

function SearchDocumentView<T extends Record<string, any>>({ onSelect }: { onSelect: Function }) {
    return (
        <div className={styles.SearchDocumentView}>
            <div className={styles.InnerView}>
                <SearchInput<T>
                    placeholder="Find document"
                    onSelect={onSelect}
                    endpoint="sources"
                />
            </div>
        </div>
    );
}

export default SearchDocumentView;

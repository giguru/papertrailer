import React, {ChangeEvent, useId, useState} from 'react';
import TextInput from "../forms/TextInput";
import styles from './SearchInput.module.scss';
import {useQuery} from "react-query";
import axios from "axios";
import {ServerIndexResponse} from "../../api/api";
import NoResults from "../NoResults";


interface SearchInputProps {
    placeholder: string,
    onSelect: Function,
    endpoint: string,
}

function SearchInput<TItem extends Record<string, string>>({ placeholder, onSelect, endpoint }: SearchInputProps ) {
    const id = useId();
    const [query, setQuery] = useState('');
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        [endpoint, id, query],
        () => axios.get<ServerIndexResponse<TItem[]>>(endpoint, { params: { q: query, type :['file'] }})
    );

    let items : TItem[] | undefined = undefined;
    if (fullData?.data) {
        items = fullData.data.data;
    }

    return (
        <div className={styles.SearchInput}>
            <TextInput
                value={query}
                name="q"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onBlur={() => undefined}
                placeholder={placeholder}
                autoFocus
            />
            <div className={styles.ResultsContainer}>
                {query.length > 0 && items && Array.isArray(items) && (
                    items.length
                        ? items.map((item) => (
                            <div onClick={() => onSelect(item)} className={styles.Result} dangerouslySetInnerHTML={{ __html: item.title }} />
                        ))
                        : <NoResults>No files found</NoResults>
                )}
            </div>
        </div>
    );
}

export default SearchInput;

import React, {ChangeEvent, useId, useState} from 'react';
import TextInput from "../forms/TextInput";
import styles from './SearchInput.module.scss';
import {useQuery} from "react-query";
import axios from "axios";
import {ServerIndexResponse} from "../../api/api";
import {ApiFileInterface} from "../../api/models";


interface SearchInputProps {
    placeholder: string,
    onSelect: Function,
    endpoint: string,
}

function SearchInput<TItem extends Record<string, string>>({ placeholder, onSelect, endpoint }: SearchInputProps ) {
    const id = useId();
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        [endpoint, id],
        () => axios.get<ServerIndexResponse<TItem>>(endpoint)
    );
    const [query, setQuery] = useState('');

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
            <div>
                {query.length > 0 && items && Array.isArray(items) && (
                    items.map((item) => (
                        <div onClick={() => onSelect(item)} className={styles.Result}>
                            {item.title}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchInput;

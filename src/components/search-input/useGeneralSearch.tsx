import {useId, useState} from "react";
import {useQuery} from "react-query";
import * as React from "react";
import axios from "axios";
import {useTimeout} from "../../utils/hooks/useTimeout";
import {ServerIndexResponse} from "../../api/api";
import {ApiSearchInterface} from "../../api/models";

export type SearchType = 'file' | 'relation' | 'comment' | 'user';

export default function useGeneralSearch({ types }: { types: SearchType[] }) {
    const id = useId();
    const { doTimeout } = useTimeout({ time: 500 });
    const [value, setValue] = useState('');
    const [isDelaying, setDelaying] = useState(false);
    const [immediateValue, setImmediateValue] = useState('');
    const { data: fullData, error, isFetching, refetch } = useQuery(
        ['search', id, value],
        () => axios.get<ServerIndexResponse<ApiSearchInterface[]>>(
            `/search?q=${value}&${types.map((t) => `type[]=${t}`).join('&')}`
        ),
        { enabled: Boolean(value) }
    );

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { value: string }}) => {
        setImmediateValue(e.target.value);
        setDelaying(true);
        doTimeout(() => {
            setDelaying(false);
            setValue(e.target.value);
        })
    };
    const clear = () => {
        setDelaying(false);
        setImmediateValue('');
        setValue('');
    }

    const results : ApiSearchInterface[] | undefined = fullData?.data.data || undefined;

    return {
        value: immediateValue,
        results,
        onChange,
        error,
        clear,
        isSearching: isFetching || isDelaying,
    }
}

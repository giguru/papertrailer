import {useQuery} from "react-query";
import axios from "axios";
import {ApiSourceInterface} from "../models";
import {ServerIndexResponse} from "../api";

interface SourceIndex {
    sources: ApiSourceInterface[] | undefined;
    isLoading: boolean,
    isFetching: boolean,
    error: unknown,
}

function useSources() : SourceIndex {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        'sources',
        () => axios.get<ServerIndexResponse<ApiSourceInterface[]>>('/sources')
    );

    const returnData : ApiSourceInterface[] | undefined = fullData?.data.data || undefined;

    return {
        sources: returnData,
        error,
        isLoading,
        isFetching,
    };
}

export { useSources };

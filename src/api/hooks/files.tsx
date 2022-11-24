import {useQuery} from "react-query";
import axios from "axios";
import {ApiFileInterface} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";


export function useFile(id: string | number, params: Record<string, any> | undefined = undefined) {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['file', id],
        () => axios.get<ServerGetResponse<ApiFileInterface>>(`/files/${id}`, { params: params })
    );

    const returnData : ApiFileInterface | undefined = fullData?.data.data || undefined;

    return {
        file: returnData,
        error,
        isLoading,
        isFetching,
    };
}

export function useFiles({ with: withParam }: { with?: string[] }) {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['files'],
        () => axios.get<ServerIndexResponse<ApiFileInterface[]>>(`/files`, { params: { _with: withParam || [], _orderBy: 'created_at' }}),
        { retry: 2 },
    );

    const returnData : ApiFileInterface[] | undefined = fullData?.data.data || undefined;

    return {
        files: returnData,
        error,
        isLoading,
        isFetching,
    };
}

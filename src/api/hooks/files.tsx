import {useQuery} from "react-query";
import axios from "axios";
import {ApiFileInterface} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";


export function useFile(id: string | number, params: Record<string, any> | undefined = undefined) {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['file', id],
        () => axios.get<ServerGetResponse<ApiFileInterface>>(`/files/${id}`, { params: params })
    );

    let returnData : ApiFileInterface | undefined = undefined;
    if (fullData?.data) {
        returnData = fullData.data.data;
    }

    return {
        file: returnData,
        error,
        isLoading,
        isFetching,
    };
}

export function useFiles(id: string | number) {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['file', id],
        () => axios.get<ServerIndexResponse<ApiFileInterface>>(`/files`)
    );

    let returnData : ApiFileInterface[] | undefined = undefined;
    if (fullData?.data) {
        returnData = fullData.data.data;
    }

    return {
        files: returnData,
        error,
        isLoading,
        isFetching,
    };
}

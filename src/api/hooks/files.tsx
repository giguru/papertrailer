import {useMutation, useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {ApiFileInterface} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";
import {useDisappearingFeedback} from "../../utils/hooks/useDisappearingFeedback";
import {useState} from "react";


export function useFile(id: string | number, params: Record<string, any> | undefined = undefined) {
    const [axiosError, setAxiosError] = useState('');
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['file', id],
        () => {
            setAxiosError('');
            return axios.get<ServerGetResponse<ApiFileInterface>>(`/files/${id}`, { params: params })
                .catch((err: AxiosError) => {
                    setAxiosError(err.message)
                })
        }
    );

    const returnData : ApiFileInterface | undefined = fullData?.data.data || undefined;

    return {
        file: returnData,
        error: axiosError || error,
        isLoading,
        isFetching,
    };
}

export function useFiles({ with: withParam }: { with?: string[] }) {
    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
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
        refetch,
    };
}

interface useDeleteFilesInterface {
    onSettled: () => void
    onError: (err: AxiosError) => void
}

export function useDeleteFiles({ onSettled, onError }: useDeleteFilesInterface) {
    const { feedback, setFeedback } = useDisappearingFeedback();

    const { mutate: deleteFiles } = useMutation(
        'delete-files',
        (ids: string[]) => axios.delete(`files/${ids.join(',')}`)
            .then(() => {
                setFeedback(`Deleted ${ids.length} files`);
            })
            .catch(onError),
        {
            onSettled: () => {
                onSettled();
            },
        }
    );
    return {
        deleteFiles,
        feedback
    }
}

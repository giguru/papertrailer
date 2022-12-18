import {useMutation, useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {ApiLabelInterface} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";
import {useDisappearingFeedback} from "../../utils/hooks/useDisappearingFeedback";
import {useState} from "react";


export function useLabel(id: string | number, params: Record<string, any> | undefined = undefined) {
    const [axiosError, setAxiosError] = useState('');
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['label', id],
        () => {
            setAxiosError('');
            return axios.get<ServerGetResponse<ApiLabelInterface>>(`/labels/${id}`, { params: params })
                .catch((err: AxiosError) => {
                    setAxiosError(err.message)
                })
        }
    );

    const returnData : ApiLabelInterface | undefined = fullData?.data.data || undefined;

    return {
        label: returnData,
        error: axiosError || error,
        isLoading,
        isFetching,
    };
}

export function useLabels({ with: withParam }: { with?: string[] }) {
    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['labels'],
        () => axios.get<ServerIndexResponse<ApiLabelInterface[]>>(`/labels`, { params: { _with: withParam || [], _orderBy: 'created_at' }}),
        { retry: 2 },
    );

    const returnData : ApiLabelInterface[] | undefined = fullData?.data.data || undefined;

    return {
        labels: returnData,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}

interface useDeleteInterface {
    onSettled: () => void
    onError: (err: AxiosError) => void
}

export function useDeleteLabels({ onSettled, onError }: useDeleteInterface) {
    const { feedback, setFeedback } = useDisappearingFeedback();

    const { mutate: deleteLabels } = useMutation(
        'delete-labels',
        (ids: string[]) => axios.delete(`labels/${ids.join(',')}`)
            .then(() => {
                setFeedback(`Deleted ${ids.length} labels`);
            })
            .catch(onError),
        {
            onSettled: () => {
                onSettled();
            },
        }
    );
    return {
        deleteLabels,
        feedback
    }
}

import {useMutation, useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {ApiOrganisation} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";
import {useDisappearingFeedback} from "../../utils/hooks/useDisappearingFeedback";
import {useState} from "react";

export function useOrganisation(id: string | number, params: Record<string, any> | undefined = undefined) {
    const [axiosError, setAxiosError] = useState('');
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['organisations', id],
        () => {
            setAxiosError('');
            return axios.get<ServerGetResponse<ApiOrganisation>>(`/organisations/${id}`, { params: params })
                .catch((err: AxiosError) => {
                    setAxiosError(err.message)
                })
        }
    );

    const returnData : ApiOrganisation | undefined = fullData?.data.data || undefined;

    return {
        label: returnData,
        error: axiosError || error,
        isLoading,
        isFetching,
    };
}

export function useOrganisations({ with: withParam }: { with?: string[] }) {
    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['organisations'],
        () => axios.get<ServerIndexResponse<ApiOrganisation[]>>(`/organisations`, { params: { _with: withParam || [], _orderBy: 'created_at' }}),
        { retry: 2 },
    );

    const returnData : ApiOrganisation[] | undefined = fullData?.data.data || undefined;

    return {
        organisations: returnData,
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
        'organisations-labels',
        (ids: string[]) => axios.delete(`organisations/${ids.join(',')}`)
            .then(() => {
                setFeedback(`Deleted ${ids.length} organisations`);
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

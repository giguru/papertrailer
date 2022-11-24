import {useQuery} from "react-query";
import axios, {AxiosResponse} from "axios";
import {ApiCommentsInterface, CommentType} from "../models";
import {ServerIndexResponse} from "../api";

export function useComments(
    type: CommentType,
    id: string | number,
    { _with: additionalWith }: { _with: string[]} = { _with: []},
) {
    const searchParams = new URLSearchParams({
        type: String(type),
        type_id: String(id),
    });

    ['createdBy'].concat(additionalWith || []).map(w => searchParams.append('_with', w))

    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['comments', id, type],
        () => axios.get<ServerIndexResponse<ApiCommentsInterface[]>>(`/comments?${searchParams.toString()}`)
    );

    const returnData : ApiCommentsInterface[] | undefined = fullData?.data.data || undefined;

    return {
        comments: returnData,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}

export function useComment(
    id: string | number,
    { _with: additionalWith }: { _with: string[]} = { _with: []},
) {
    const searchParams = new URLSearchParams({});
    ['createdBy'].concat(additionalWith || []).map(w => searchParams.append('_with', w))

    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['comments', id],
        () => axios.get<ServerIndexResponse<ApiCommentsInterface>>(`/comments/${id}?${searchParams.toString()}`)
    );

    const returnData : ApiCommentsInterface | undefined = fullData?.data.data || undefined;

    return {
        comment: returnData,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}

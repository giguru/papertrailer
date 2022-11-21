import {useQuery} from "react-query";
import axios from "axios";
import {ApiCommentsInterface} from "../models";
import {ServerIndexResponse} from "../api";

export type CommentType = 'relation' | 'file'


export function useComments(type: CommentType, id: string | number) {
    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['comments', id, type],
        () => axios.get<ServerIndexResponse<ApiCommentsInterface[]>>(`/comments?type=${type}&type_id=${id}&_with[]=createdBy`)
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

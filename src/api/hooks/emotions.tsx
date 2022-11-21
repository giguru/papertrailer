import {useQuery} from "react-query";
import axios from "axios";
import {ApiEmotionCounts} from "../models";
import {ServerGetResponse} from "../api";

export type EmotionType = 'relation' | 'comment' | 'file';


export function useEmotionCounts(type: EmotionType, id: string | number) {
    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['emotions', type, id, 'counts'],
        () => axios.get<ServerGetResponse<ApiEmotionCounts>>(
            `/emotions/counts`,
            {
                params: { type, type_id: id }
            },
        )
    );

    const returnData : ApiEmotionCounts | undefined = fullData?.data.data || undefined;

    return {
        counts: returnData,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}

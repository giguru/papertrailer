import {useQuery} from "react-query";
import axios from "axios";
import {ApiFileInterface, ApiRelationInterface} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";


export function useSourceRelations(id: string | number) {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['sources', id, 'relations'],
        () => axios.get<ServerIndexResponse<ApiRelationInterface[]>>(`/sources/${id}/relations`)
    );

    const returnData : ApiRelationInterface[] | undefined = fullData?.data.data || undefined;

    return {
        relations: returnData,
        error,
        isLoading,
        isFetching,
    };
}

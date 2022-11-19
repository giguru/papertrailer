import {useQuery} from "react-query";
import axios from "axios";
import {ApiFileInterface, ApiRelationInterface} from "../models";
import {ServerGetResponse, ServerIndexResponse} from "../api";


export function useFileRelations(id: string | number) {
    const { data: fullData, error, isLoading, isFetching } = useQuery(
        ['files', id, 'relations'],
        () => axios.get<ServerIndexResponse<ApiRelationInterface[]>>(`/files/${id}/relations`)
    );

    const returnData : ApiRelationInterface[] | undefined = fullData?.data.data || undefined;

    return {
        relations: returnData,
        error,
        isLoading,
        isFetching,
    };
}

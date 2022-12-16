import {useQuery} from "react-query";
import axios from "axios";
import {ApiRelationInterface} from "../models";
import {ServerIndexResponse} from "../api";


export function useFileRelations(id: string | number, { _with: additionalWith }: { _with: string[]} = { _with: []},) {

    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['files', id, 'relations'],
        () => axios.get<ServerIndexResponse<ApiRelationInterface[]>>(`/files/${id}/relations`, { params: {
                _with: additionalWith
            } })
    );

    const returnData : ApiRelationInterface[] | undefined = fullData?.data.data || undefined;

    return {
        relations: returnData,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}

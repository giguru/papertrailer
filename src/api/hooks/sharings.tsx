import {useQuery} from "react-query";
import axios from "axios";
import {ServerIndexResponse} from "../api";
import {ApiSharingInterface} from "../models";


function useSharings(fileId: string | number, { _with: additionalWith }: { _with: string[]} = { _with: []},) {

    const { data: fullData, error, isLoading, isFetching, refetch } = useQuery(
        ['files', fileId, 'sharings'],
        () => axios.get<ServerIndexResponse<ApiSharingInterface[]>>(`/files/${fileId}/sharings`, { params: {
                _with: additionalWith
            } })
    );

    const returnData : ApiSharingInterface[] | undefined = fullData?.data.data || undefined;

    return {
        sharings: returnData,
        error,
        isLoading,
        isFetching,
        refetch,
    };
}

export {
    useSharings
}

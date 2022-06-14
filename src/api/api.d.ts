export interface ServerIndexResponse<T> {
    data: T[] | undefined;
}

export interface ServerGetResponse<T> {
    data: T | undefined;
}

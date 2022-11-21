export interface ServerIndexResponse<T> {
    data: T | undefined;
}

export interface ServerGetResponse<T> {
    data: T | undefined;
}


export interface ServerResponse<T = {}> {
    data: T | undefined;
    message: string | undefined;
}

export interface ServerErrorResponse<T extends {[key: string]: any}> {
    message: string | undefined,
    errors: T
}

export type APIResponse = {
    statusCode: number;
    body: string;
};

export type APIErrorResponse<T> = {
    statusCode: number;
    body: T & {
        error: string;
        errorStack?: unknown;
    };
};

// export type ErrorResponse<T> = APIErrorResponse & T;

export type NotFoundError = {
    code: "not_found";
    message: string;
};

export type UsernameTakenError = {
    code: "username_taken";
    error: string;
};

export type InternalError = {
    code: "internal_error";
    error: string;
};

export type InputError = {
    code: "invalid_input";
    error: string;
};

export type ValidationError = {
    code: "validation_failed";
    error: string;
};

export type DomainError = NotFoundError | UsernameTakenError | InternalError;

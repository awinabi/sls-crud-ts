import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { APIErrorResponse, APIResponse } from "@helpers/api-response";

import { UserInputSchema, UserType } from "../user.entity";
import { UserRepository } from "../user.repository";
import {
    UsernameTakenError,
    InternalError,
    InputError,
    ValidationError,
} from "./errors";

const dynamoClient = new DynamoDB.DocumentClient();

export const handle = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<APIResponse> => {
    console.log("user create function");

    if (!event.body) {
        console.error("Invalid input: no request body");
        const invalidInputResponse: APIResponse = {
            statusCode: 422,
            body: JSON.stringify({
                code: "invalid_input",
                error: "No input body",
            }),
        };
        return invalidInputResponse;
    }

    const data = JSON.parse(event.body);
    const { error } = UserInputSchema.validate(data);
    if (error) {
        console.error("payload validation failed");
        const validationErrorResponse: APIResponse = {
            statusCode: 422,
            body: JSON.stringify({
                code: "validation_failed",
                error: "Input data is invalid",
            }),
        };
        return validationErrorResponse;
    }
    const userRepository = new UserRepository(dynamoClient);

    try {
        const createdUser = await userRepository.create(data);
        const response: APIResponse = {
            body: JSON.stringify(createdUser),
            statusCode: 201,
        };
        return response;
    } catch (err) {
        const error = err as Error;
        const errorResponse: APIResponse = {
            statusCode: 500,
            body: JSON.stringify({
                code: "internal_error",
                error: error.message,
                errorStack: error.stack,
            }),
        };
        return errorResponse;
    }
};

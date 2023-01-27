import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { APIErrorResponse, APIResponse } from "@helpers/api-response";
import { UserInputSchema } from "../user.entity";
import { UserRepository } from "../user.repository";

const dynamoClient = new DynamoDB.DocumentClient();

export const handle = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<APIResponse> => {
    console.log("uesr Update");
    if (!event.body) {
        console.log("Invalid Input: body doesn't contain data");
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
    const id = event.pathParameters?.id;
    const userUpdateRepositoiry = new UserRepository(dynamoClient);
    try {
        const updateUser = await userUpdateRepositoiry.update(data, id);
        const response: APIResponse = {
            body: JSON.stringify(updateUser),
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

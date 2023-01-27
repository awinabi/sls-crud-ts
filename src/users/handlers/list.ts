import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { AppEnv } from "@helpers/env";
import { UserRepository } from "../user.repository";
import { APIResponse } from "@helpers/api-response";
const dynamoClient = new DynamoDB.DocumentClient();

export const handle = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<APIResponse> => {
    console.log("User list");
    // const params = {
    //     TableName: AppEnv.dynamoDbTableName,
    //     Key: {},
    //     Limit: 10,
    // };

    // dynamoClient.get(params, (error, result) => {
    //     if (error) {
    //         console.error(error);
    //         callback(null, {
    //             statusCode: error.statusCode || 501,
    //             headers: { "Content-Type": "text/plain" },
    //             body: "Couldn't fetch the user item.",
    //         });
    //         return;
    //     }
    //     const response = {
    //         statusCode: 200,
    //         body: JSON.stringify(result.Item),
    //     };
    //     callback(null, response);
    // });
    const listUserRepository = new UserRepository(dynamoClient);
    try {
        const listUser = await listUserRepository.list();
        const response: APIResponse = {
            body: JSON.stringify(listUser),
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

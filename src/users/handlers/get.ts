import { v4 as getUUID } from "uuid";

import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { AppEnv } from "@helpers/env";
import { UserRepository } from "../user.repository";
import { APIResponse } from "@helpers/api-response";
import { client } from "@helpers/dynamodb.client.v2";

const dynamoClient = new DynamoDB.DocumentClient();

export const handle = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<APIResponse> => {
    console.log("user get function");
    // const params = {
    //     TableName: AppEnv.dynamoDbTableName,
    //     KeyConditionExpression: 'PK = :userId',
    //     ExpressionAttributeValues:  {
    //         ':userId': event.pathParameters?.userId,
    //     }        
    // };
    const data = event.pathParameters?.userId;

    const userRepository = new UserRepository(dynamoClient);
    try {
        const createdUser = await userRepository.get(data);
        const response: APIResponse = {
            body: JSON.stringify(createdUser),
            statusCode: 201,
        };
        return response;
    }catch(err){
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
    // fetch from the database
    // client.query(params, (error, result) => {
        
    //     // handle potential errors
    //     if (error) {
    //         console.error(error);
    //         const errorResponse = {
    //             statusCode: error.statusCode || 501,
    //             // headers: { "Content-Type": "text/plain" },
    //             body: "Couldn't fetch the user item.",
    //         } 
    //         // callback(null, {
    //         //     statusCode: error.statusCode || 501,
    //         //     headers: { "Content-Type": "text/plain" },
    //         //     body: "Couldn't fetch the user item.",
    //         // });
    //         return errorResponse;
    //     }

    //     // create a response
    //     const response = {
    //         statusCode: 200,
    //         body: JSON.stringify(result.Items),
    //     };
    //     console.log(response);
    //     return response;
    //     // callback(null, response);
    // });
};

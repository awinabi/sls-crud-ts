import { v4 as getUUID } from "uuid";

import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { AppEnv } from "@helpers/env";

const dynamoClient = new DynamoDB.DocumentClient();

export const handle = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<void> => {
    console.log("user get function");
    const params = {
        TableName: AppEnv.dynamoDbTableName,
        Key: {
            "PK": event.pathParameters?.userId,
        },
    };
    
    // fetch from the database
    dynamoClient.get(params, (error, result) => {
        console.log(params);
        console.log(result)
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { "Content-Type": "text/plain" },
                body: "Couldn't fetch the user item.",
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};

import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { AppEnv } from "@helpers/env";
const dynamoClient = new DynamoDB.DocumentClient();

export const handle = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<void> => {
    console.log("User list");
    const params = {
        TableName: AppEnv.dynamoDbTableName,
        Key: {},
    };

    dynamoClient.get(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { "Content-Type": "text/plain" },
                body: "Couldn't fetch the user item.",
            });
            return;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};

import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";
import { APIErrorResponse, APIResponse } from "@helpers/api-response";

const dynamoClient = new DynamoDB.DocumentClient();

const api = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: `https://${process.env.WS_SERVICE_URL}`,
    maxRetries: 5,
    httpOptions: {
        timeout: 200,
    },
});

export const connectDisconnectHandler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<any> => {
    console.log("websocket DEVICE connect/disco function");
    const { eventType, connectionId } = event.requestContext;
    if (eventType == "CONNECT") {
        console.log("Device Connection request ", { connectionId });
        return { body: JSON.stringify({ status: "SUCCESS" }) };
    } else {
        console.log("Event", eventType, connectionId);
    }
};

export const msgHandler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<any> => {
    console.log("websocket DEVICE connect/disco function");
    const { eventType, connectionId } = event.requestContext;
    if (eventType == "MESSAGE") {
        if (event.body && connectionId) {
            console.log("Message ", JSON.parse(event.body));
            const params = {
                ConnectionId: connectionId,
                Data: JSON.stringify({ message: "hello response for device!" }),
            };
            await api.postToConnection(params).promise();
            return { body: JSON.stringify({ status: "SUCCESS" }) };
        }
    } else {
        console.log("Event", eventType, connectionId);
    }
};

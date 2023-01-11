import { DynamoDB } from "aws-sdk";
import { AppEnv } from "./env";

function getDynamoConfig() {
    if (AppEnv.dev) {
        return {
            region: "us-west-1",
            accessKeyId: "access_key_id",
            secretAccessKeyId: "secret_access_key_id",
            endpoint: "http://localhost:8000",
        };
    }
}

const dynamoConfig = getDynamoConfig() || {};
export const client = new DynamoDB.DocumentClient(dynamoConfig);
// TODO: can be a DBClient class

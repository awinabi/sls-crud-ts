import { DynamoDB } from "aws-sdk";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

import { AppEnv } from "@helpers/env";
import { Repository } from "@helpers/base.repository";
import { client } from "@helpers/dynamodb.client.v2";

import { UserFactory, UserInputType, UserType } from "./user.entity";

export class UserCreationError extends Error {}

export class UserRepository implements Repository<UserType> {
    // TODO: dependency injection
    constructor(private dynamoDbClient: DynamoDB.DocumentClient) {}

    find(id: string): Promise<UserType> {
        throw new Error("Method not implemented.");
    }

    all(): Promise<UserType[]> {
        throw new Error("Method not implemented.");
    }

    update(id: number, data: unknown): Promise<UserType[]> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): boolean {
        throw new Error("Method not implemented.");
    }

    async create(data: unknown): Promise<UserType> {
        const userInput = data as UserInputType;
        // validated data, recheck validation
        const { firstName, lastName } = userInput;

        const userItem = new UserFactory().create(userInput);
        console.log("factory out", userItem);
        const params = {
            TableName: AppEnv.dynamoDbTableName,
            Item: userItem,
            ReturnValues: "NONE",
        };

        const dbResponse = await client.put(params).promise();

        console.log("dbResp", dbResponse);
        debugger;
        if (dbResponse.$response.error) {
            throw new UserCreationError("Error creating user");
        }

        return userItem.DATA;
    }
    async list(): Promise<unknown> {
        const params = {
            TableName: AppEnv.dynamoDbTableName,
            Key: marshall({ HashKey: "hashKey" }),
            Limit: 100,
        };
        const dbResponse = await client.scan(params).promise();
        console.log(dbResponse);
        if (dbResponse.$response.error) {
            throw new Error("Error to get users...!");
        }
        if (dbResponse.Items === undefined) {
            return [];
        }
        return dbResponse.Items;
    }
}

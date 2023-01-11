import { BaseDynamodbEntity } from "@helpers/base.entity";
import { v4 as getUUID } from "uuid";
import Joi from "joi";

export type UserType = {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
};

export type DynamoEntity<T> = BaseDynamodbEntity & { DATA: T };
export type UserEntity = DynamoEntity<UserType>;

// Validation Schema
export const UserSchema = Joi.object({
    id: Joi.string().uuid(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    username: Joi.string().alphanum().min(3).max(30).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
});

// Example Entry
const timestamp = new Date().getTime();
export const ExampleUser: UserEntity = {
    PK: "USR:9db611e7-8f87-4814-9bd0-6eaf97e09742",
    SK: "John Doe",
    CREATED: timestamp,
    UPDATED: timestamp,
    DATA: {
        id: "USR:9db611e7-8f87-4814-9bd0-6eaf97e09742",
        email: "john@example.com",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
    },
};

// User input payload
export type UserInputType = {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
};

export const UserInputSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    username: Joi.string().alphanum().min(3).max(30).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
});

export function getFullName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`;
}

export class UserFactory {
    create(userInput: UserInputType): UserEntity {
        const timestamp = new Date().getTime();
        const { firstName, lastName } = userInput;
        const userId = `USR:${getUUID()}`;
        const fullName = getFullName(firstName, lastName);
        return {
            PK: userId,
            SK: fullName,
            DATA: { id: userId, ...userInput },
            CREATED: timestamp,
            UPDATED: timestamp,
        };
    }
}

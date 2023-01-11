const getTableName = (): string => {
    const tableNameEnv = process.env.DYNAMODB_TABLE_NAME;

    if (tableNameEnv === undefined) {
        new Error("Dynamo DB table not configured");
    }

    return tableNameEnv as string;
};

export const AppEnv = {
    dynamoDbTableName: getTableName(),
    dev: process.env.SLS_DEVELOPMENT == "true" ? true : false,
};

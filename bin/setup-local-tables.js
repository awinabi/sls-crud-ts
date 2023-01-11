const path = require("path");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const { Config } = require("sls-config-parser");
// const cloudformationSchema = require("@serverless/utils/cloudformation-schema");

const SERVERLESS_CONFIG = path.resolve(__dirname, "..") + "/serverless.yml";

const ddb = new DynamoDB({
    accessKeyId: "access_key_id",
    secretAccessKey: "secret_access_key_id",
    endpoint: "http://localhost:8000",
    region: "us-west-1",
});

async function getDynamoDBTableResources() {
    const customCfg = new Config({ stage: "dev", _path: SERVERLESS_CONFIG });
    const slsConfig = customCfg.config();
    console.log("R2", slsConfig.resources?.Resources);
    console.log("Resources2 —");

    const tables = Object.entries(slsConfig.resources?.Resources).filter(
        ([, resource]) => resource.Type === "AWS::DynamoDB::Table"
    );
    return tables;
}

(async function main() {
    console.info("Setting up local DynamoDB tables");
    const tables = await getDynamoDBTableResources();
    console.info("For tables", JSON.stringify(tables));
    const existingTables = (await ddb.listTables().promise()).TableNames;

    for await ([logicalId, definition] of tables) {
        const {
            Properties: {
                BillingMode,
                TableName,
                AttributeDefinitions,
                KeySchema,
                GlobalSecondaryIndexes,
                LocalSecondaryIndexes,
                ProvisionedThroughput,
            },
        } = definition;

        if (existingTables.find((table) => table === TableName)) {
            console.info(
                `${logicalId}: DynamoDB Local - Table already exists: ${TableName}. Skipping..`
            );
            continue;
        }

        const result = await ddb
            .createTable({
                AttributeDefinitions,
                BillingMode,
                KeySchema,
                LocalSecondaryIndexes,
                GlobalSecondaryIndexes,
                ProvisionedThroughput,
                TableName,
            })
            .promise();

        console.info(
            `${logicalId}: DynamoDB Local - Created table: ${TableName}`
        );
    }
})();

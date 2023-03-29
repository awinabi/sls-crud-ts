const fs = require("fs");
const path = require("path");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const yaml = require("js-yaml");
const cloudformationSchema = require("@serverless/utils/cloudformation-schema");

const SERVERLESS_CONFIG = path.resolve(__dirname, "..") + "/serverless.yml";

const ddb = new DynamoDB({
    accessKeyId: "access_key_id",
    secretAccessKey: "secret_access_key_id",
    endpoint: "http://localhost:8000",
    region: "us-west-1",
});

async function getDynamoDBTableResources(fileName) {
    // const customCfg = new Config({ stage: "dev", _path: SERVERLESS_CONFIG });
    // const slsConfig = customCfg.config();
    // console.log("R2", slsConfig.resources?.Resources);
    // console.log("Resources2 —");

    const tables = Object.entries(
        yaml.loadAll(fs.readFileSync(fileName), {
            schema: cloudformationSchema,
        })[0]
    ).filter(
        ([, resource]) =>
            resource.Type === "AWS::DynamoDB::Table" ||
            resource.Type === "AWS::DynamoDB::GlobalTable"
    );
    return tables;
}

(async function main() {
    if (process.argv.length < 4) {
        console.error("Not enough arguments");
        process.exit(1);
    }
    const fileName = process.argv[2];
    const tableName = process.argv[3];

    console.info("Setting up local DynamoDB tables");
    const tables = await getDynamoDBTableResources(fileName);
    console.info("For tables", JSON.stringify(tables));
    const existingTables = (await ddb.listTables().promise()).TableNames;

    for await ([logicalId, definition] of tables) {
        const {
            Properties: {
                BillingMode,
                AttributeDefinitions,
                KeySchema,
                GlobalSecondaryIndexes,
                LocalSecondaryIndexes,
            },
        } = definition;

        if (existingTables.find((table) => table === tableName)) {
            console.info(
                `${logicalId}: DynamoDB Local - Table already exists: ${tableName}. Skipping..`
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
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
                TableName: tableName,
            })
            .promise();

        console.info(
            `${logicalId}: DynamoDB Local - Created table: ${tableName}`
        );
    }
})();

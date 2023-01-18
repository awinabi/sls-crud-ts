# CRUD with Serverless

A User CRUD example with serverless framework in AWS Lambda and DynamoDB.

## Development Setup

### DynamoDB

-   Download the local version of DynamoDB from [AWS DynamoDB Download](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).
-   Unzip the contents in the `dynamodb-local` folder
-   Start dynamodb using `npm run dynamodb:start`. This requires an installation of JRE, and the `java` command.
-   Create dynamodb tables using `npm run dynamodb:setup`, and verify the existance of the tables using `npm run dynamodb:list`

### Serverless Offline

-   Run serverless offline with `npm run serve`

### Multiple Websockets API

-   Serverless framework allows only one api for REST, and one for websockets from a single serverless.yml file. If multiple websocket APIs needs to be deployed, it has to be in different services. For facilitiating there are 2 serverless yml files
    -   `serverless.yml` has just the REST APIs and the websocket APIs for user, `service: sls-crud`
    -   `serverless-device.yml` has definitions of the websocket APIs for device, in service `service: sls-crud-device`

### Deploy

-   Deploy using `npx sls deploy`
-   For websockets device handlers, `npx sls deploy --config serverless-device.yml`

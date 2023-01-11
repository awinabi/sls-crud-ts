# CRUD with Serverless

A User CRUD example with serverless framework in AWS Lambda and DynamoDB.

## Development Setup

### DynamoDB

-   Download the local version of DynamoDB from [AWS DynamoDB Download](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).
-   Unzip the contents in the `dynamodb-local` folder
-   Start dynamodb using `npm run dynamodb:start`
-   Create dynamodb tables using `npm run dynamodb:setup`, and verify the existance of the tables using `npm run dynamodb:list`

### Serverless Offline

-   Run serverless offline with `npm run serve`

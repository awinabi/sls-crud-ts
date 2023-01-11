export type BaseDynamodbEntity = {
    PK: string;
    SK: string;
    GSI_1_PK?: string;
    GSI_1_SK?: string;
    GSI_2_PK?: string;
    GSI_2_SK?: string;
    CREATED: number;
    UPDATED: number;
}

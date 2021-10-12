import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient } from '../ts';

export default class DynamoDBWrapper implements DynamoDBClient {
    private ddb: DynamoDB;

    constructor(ddb: DynamoDB) {
        this.ddb = ddb;
    }

    async getItem(tableName: string, key: string): Promise<any> {
        const getItemParams = {
            TableName: tableName,
            Key: { 'testKey': { 'S' : key } }
        };

        return this.ddb.getItem(getItemParams)
            .then(result => result.Item);
    }
}
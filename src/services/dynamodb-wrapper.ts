import { DynamoDB } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBClient,
    Key,
    Item,
    QueryParams
} from '../ts';

export default class DynamoDBWrapper implements DynamoDBClient {
    private ddb: DynamoDB;

    constructor(ddb: DynamoDB) {
        this.ddb = ddb;
    }

    async getItem(tableName: string, key: Key): Promise<any> {
        const getItemParams = {
            TableName: tableName,
            Key: { 'testKey': { 'S' : key } }
        };

        return this.ddb.getItem(getItemParams)
            .then(result => result.Item);
    }

    async query(tableName: string, params: QueryParams): Promise<any> {

    }

    async putItem(tableName: string, item: Item): Promise<any> {

    }

    async batchPutItem(tableName: string, items: Item[]): Promise<any> {

    }
}
import { DynamoDB, GetItemInput, PutItemInput, QueryInput } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBClient
} from '../ts';

export default class DynamoDBWrapper implements DynamoDBClient {
    private ddb: DynamoDB;

    constructor(ddb: DynamoDB) {
        this.ddb = ddb;
    }

    async getItem(params: GetItemInput): Promise<any> {
        return this.ddb.getItem(params)
            .then(result => result.Item);
    }

    async query(params: QueryInput): Promise<any> {
        return this.ddb.query(params)
            .then(result => result.Items)
    }

    async putItem(params: PutItemInput): Promise<any> {
        return this.ddb.putItem(params);
    }
}
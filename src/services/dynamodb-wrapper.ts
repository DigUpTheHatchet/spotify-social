import { BatchWriteItemInput, DynamoDB, GetItemInput, PutItemInput, QueryInput } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '../utils/dynamoDBUtils2';
import { DynamoDBClient } from '../ts';
import Bluebird from 'bluebird';
import * as _ from 'lodash';

export default class DynamoDBWrapper implements DynamoDBClient {
    private ddb: DynamoDB;

    constructor(ddb: DynamoDB) {
        this.ddb = ddb;
    }

    async getItem(params: GetItemInput): Promise<any> {
        return this.ddb.getItem(params)
            .then(result => result.Item ? unmarshall(result.Item) : undefined);
    }

    async query(params: QueryInput): Promise<any> {
        return this.ddb.query(params)
            .then(result => result.Items?.map(item => unmarshall(item)));
    }

    async putItem(tableName: string, item: any): Promise<any> {
        const params: PutItemInput = {
            TableName: tableName,
            Item: marshall(item)
        };

        return this.ddb.putItem(params);
    }

    async batchWriteItems(tableName: string, items: any[]): Promise<any> {
        const marshalledItems = items.map(item => Object.assign({}, { PutRequest: { Item: marshall(item)} }));
        const chunkedItems = _.chunk(marshalledItems, 25);

        return Bluebird.map(chunkedItems, (chunk) => this.batchWriteItem(tableName, chunk));
    }

    private async batchWriteItem(tableName: string, chunk: any[]): Promise<any> {
        const params: BatchWriteItemInput = { RequestItems: { [tableName]: chunk }};

        return this.ddb.batchWriteItem(params);
    }
}
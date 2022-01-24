import { BatchWriteItemInput, DynamoDB, GetItemInput, PutItemInput, QueryInput, CreateTableInput, DeleteTableInput, ScanInput } from '@aws-sdk/client-dynamodb';
import { unmarshallItem, marshallItem, isResourceNotFoundException } from '../utils/dynamoDBUtils';
import { DynamoDBClient } from '../ts';
import Bluebird from 'bluebird';
import * as _ from 'lodash';

export default class DynamoDBWrapper implements DynamoDBClient {
    private ddb: DynamoDB;

    constructor(ddb: DynamoDB) {
        this.ddb = ddb;
    }

    async getItem(params: GetItemInput, dateFields: string[] = []): Promise<any> {
        return this.ddb.getItem(params)
            .then(result => result.Item ? unmarshallItem(result.Item, dateFields) : undefined);
    }

    async query(params: QueryInput, dateFields: string[] = []): Promise<any> {
        // TODO: Is there a built in limit to the num items returned? Check this and add pagination if required
        return this.ddb.query(params)
            .then(result => result.Items?.map(item => unmarshallItem(item, dateFields)));
    }

    async scan(params: ScanInput, dateFields: string[] = []): Promise<any> {
        return this.ddb.scan(params)
            .then(result => result.Items?.map(item => unmarshallItem(item, dateFields)));
    }

    async putItem(tableName: string, item: any, dateFields: string[] = []): Promise<any> {
        const params: PutItemInput = {
            TableName: tableName,
            Item: marshallItem(item, dateFields)
        };

        return this.ddb.putItem(params);
    }

    async batchWriteItems(tableName: string, items: any[], dateFields: string[] = []): Promise<any> {
        const marshalledItems = items.map(item => Object.assign({}, { PutRequest: { Item: unmarshallItem(item, dateFields)} }));
        const chunkedItems = _.chunk(marshalledItems, 25);

        return Bluebird.map(chunkedItems, (chunk) => this._batchWriteItem(tableName, chunk));
    }

    async _batchWriteItem(tableName: string, chunk: any[]): Promise<any> {
        const params: BatchWriteItemInput = { RequestItems: { [tableName]: chunk }};

        return this.ddb.batchWriteItem(params);
    }

    async createTable(params: CreateTableInput): Promise<any> {
        return this.ddb.createTable(params);
    }

    async deleteTable(tableName: string): Promise<any> {
        const params: DeleteTableInput = { TableName: tableName };

        return this.ddb.deleteTable(params)
            .catch(err => { if (!isResourceNotFoundException(err)) { throw err; } });
    }
}
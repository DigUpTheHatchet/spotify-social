import { BatchWriteItemInput, DynamoDB, GetItemInput, PutItemInput, QueryInput } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '../utils/dynamodbUtils';
import { DynamoDBClient } from '../ts';

export default class DynamoDBWrapper implements DynamoDBClient {
    private ddb: DynamoDB;

    constructor(ddb: DynamoDB) {
        this.ddb = ddb;
    }

    async getItem(params: GetItemInput): Promise<any> {
        // return this.ddb.getItem(params)
        //     .then(result => result.Item ? unmarshall(result.Item) : undefined);
        console.log('hello')
        const result = await this.ddb.getItem(params);
        console.log({result})
        const parsed = result.Item ? unmarshall(result.Item) : undefined;
        console.log({parsed})
        return parsed
    }

    async query(params: QueryInput): Promise<any> {
        return this.ddb.query(params)
            .then(result => result.Items?.map(item => unmarshall(item)));
    }

    async putItem(tableName: string, item: any): Promise<any> {
        console.log({tableName, item})
        const params: PutItemInput = {
            TableName: tableName,
            Item: marshall(item)
        };
        console.log({params})
        return this.ddb.putItem(params);
    }

    async batchWriteItem(tableName: string, items: any[]): Promise<any> {
        const marshalledItems = items.map(item => Object.assign({}, { PutRequest: { Item: marshall(item)} }));
        const params: BatchWriteItemInput = { RequestItems: { [tableName]: marshalledItems }};

        return this.ddb.batchWriteItem(params);
    }
}
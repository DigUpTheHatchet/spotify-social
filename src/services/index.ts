import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import HttpClient from './http-client';
import DynamoDBWrapper from './dynamodb-wrapper';
import { DynamoDBClient } from '../ts';

const dynamoDBConfig: DynamoDBClientConfig = {
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
    },
    endpoint: 'http://localhost:8000' // DynamoDB Local Endpoint
};
const ddb: DynamoDB = new DynamoDB(dynamoDBConfig);

export const dynamoDBClient: DynamoDBClient = new DynamoDBWrapper(ddb);
export const httpClient = new HttpClient();

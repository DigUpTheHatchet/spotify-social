import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import HttpClient from './http-client';
import DynamoDBWrapper from './dynamodb-wrapper';
import { DynamoDBClient } from '../ts';
import {
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID,
    DYNAMODB_ENDPOINT
} from '../config';

const dynamoDBConfig: DynamoDBClientConfig = {
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    endpoint: DYNAMODB_ENDPOINT
};
const ddb: DynamoDB = new DynamoDB(dynamoDBConfig);

export const dynamoDBClient: DynamoDBClient = new DynamoDBWrapper(ddb);
export const httpClient: HttpClient = new HttpClient();

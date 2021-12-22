import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import HttpClient from './http-client';
import DynamoDBWrapper from './dynamodb-wrapper';
import { DynamoDBClient } from '../ts';
import { dynamoDBConfig } from '../config';

const ddb: DynamoDB = new DynamoDB(dynamoDBConfig);

export const dynamoDBClient: DynamoDBClient = new DynamoDBWrapper(ddb);
export const httpClient: HttpClient = new HttpClient();

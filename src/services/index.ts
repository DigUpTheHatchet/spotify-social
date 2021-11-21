import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import SpotifyClient from './spotify-client';
import HttpClient from './http-client';
import DynamoDBWrapper from './dynamodb-wrapper';
import { DynamoDBClient } from '../ts';
import { spotifyTokenStorage } from '../models';

export function getDynamoDBClient(): DynamoDBClient {
    const dynamoDBConfig: DynamoDBClientConfig = {
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy',
        },
        endpoint: 'http://localhost:8000' // DynamoDB Local Endpoint
    };
    const ddb: DynamoDB = new DynamoDB(dynamoDBConfig);
    const dynamoDBClient: DynamoDBClient = new DynamoDBWrapper(ddb);

    return dynamoDBClient;
}

const httpClient = new HttpClient();
//export const spotifyClient: SpotifyClient = new SpotifyClient(httpClient, spotifyTokenStorage);

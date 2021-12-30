import { CreateTableInput } from '@aws-sdk/client-dynamodb';
import Bluebird from 'bluebird';
import { dynamoDBClient } from '../services';

// TODO: I'd rather parse these specs from the terraform code instead of duplicating the table specs here
const ddbTableSpecs: CreateTableInput[] = [{
    TableName: 'SpotifyTokens',
    AttributeDefinitions: [{
        'AttributeName': 'userId',
        'AttributeType': 'S'
    }, {
        'AttributeName': 'type',
        'AttributeType': 'S'
    }],
    KeySchema: [{
        'AttributeName': 'userId',
        'KeyType': 'HASH'
    }, {
        'AttributeName': 'type',
        'KeyType': 'RANGE'
    }],
    ProvisionedThroughput: { 'ReadCapacityUnits': 3, 'WriteCapacityUnits': 3 }
    }, {
        TableName: 'SpotifyUsers',
        AttributeDefinitions: [{
            'AttributeName': 'userId',
            'AttributeType': 'S'
        }],
        KeySchema: [{
            'AttributeName': 'userId',
            'KeyType': 'HASH'
        }],
        ProvisionedThroughput: { 'ReadCapacityUnits': 3, 'WriteCapacityUnits': 3 }
    }, {
    TableName: 'PlayedTracks',
    AttributeDefinitions: [{
        'AttributeName': 'userId',
        'AttributeType': 'S'
    }, {
        'AttributeName': 'playedAt',
        'AttributeType': 'N'
    }],
    KeySchema: [{
        'AttributeName': 'userId',
        'KeyType': 'HASH'
    }, {
        'AttributeName': 'playedAt',
        'KeyType': 'RANGE'
    }],
    ProvisionedThroughput: { 'ReadCapacityUnits': 3, 'WriteCapacityUnits': 3 }
}];

export async function createDynamoDBTables(): Promise<void> {
    await Bluebird.map(ddbTableSpecs, (params) => dynamoDBClient.createTable(params));
}

export async function deleteDynamoDBTables(): Promise<void> {
    await Bluebird.map(ddbTableSpecs, (params) => dynamoDBClient.deleteTable(params.TableName!));
}

export async function resetDynamoDBTables(): Promise<void> {
    await deleteDynamoDBTables();
    await createDynamoDBTables();
}
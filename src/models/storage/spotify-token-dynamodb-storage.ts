import { GetItemInput, PutItemInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient, SpotifyToken, SpotifyTokenStorage } from '../../ts';

export class SpotifyTokenDynamoDBStorage implements SpotifyTokenStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, dynamoDBClient: DynamoDBClient) {
        this.tableName = tableName;
        this.dynamoDBClient = dynamoDBClient;
    }

    async getRefreshToken(userId: string): Promise<SpotifyToken> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: {
                'userId': { 'S' : userId }, // Partition Key
                'type': { 'S' : 'refresh:played-tracks' } // Range Key
            }
        };

        return this.dynamoDBClient.getItem(params);
    }

    async saveToken(userId: string, token: SpotifyToken): Promise<void> {
        const { type, value, scopes, createdAt } = token;
        const createdAtTs: string = Math.floor(createdAt.valueOf() / 1000).toString();

        const params: PutItemInput = {
            TableName: this.tableName,
            Item: {
                userId: { 'S': userId },
                type: { 'S': type },
                value: { 'S': value },
                scopes: { 'SS': scopes },
                createdAt: { 'N': createdAtTs }
            }
        };

        return this.dynamoDBClient.putItem(params);
    }
}
import { GetItemInput, PutItemInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient, SpotifyToken, SpotifyTokenStorage } from '../../ts';
import { convertDateToTs } from '../../utils/dynamodbUtils';

export class SpotifyTokenDynamoDBStorage implements SpotifyTokenStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(dynamoDBClient: DynamoDBClient, tableName: string) {
        this.tableName = tableName;
        this.dynamoDBClient = dynamoDBClient;
    }

    async getRefreshToken(userId: string): Promise<SpotifyToken> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: {
                'userId': { 'S' : userId }, // Partition Key
                'type': { 'S' : 'refresh' } // Range Key
            }
        };

        return this.dynamoDBClient.getItem(params);
    }

    async saveToken(token: SpotifyToken): Promise<void> {
        const item = { ...token, createdAt: convertDateToTs(token.createdAt) };

        return this.dynamoDBClient.putItem(this.tableName, item);
    }
}
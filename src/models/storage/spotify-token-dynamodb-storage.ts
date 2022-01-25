import { GetItemInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient, SpotifyToken, SpotifyTokenStorage } from '../../ts';

const DATE_FIELDS: string[] = ['createdAt'];

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

        const refreshToken: SpotifyToken = await this.dynamoDBClient.getItem(params, DATE_FIELDS);

        return refreshToken;
    }

    async saveToken(token: SpotifyToken): Promise<void> {
        return this.dynamoDBClient.putItem(this.tableName, token, DATE_FIELDS);
    }
}
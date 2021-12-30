import { GetItemInput } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient, SpotifyToken, SpotifyTokenStorage } from '../../ts';
import { convertDateToTs, convertTsToDate } from '../../utils/dynamoDBUtils';

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

        const item = await this.dynamoDBClient.getItem(params);
        const refreshToken: SpotifyToken = Object.assign({}, item, { createdAt: convertTsToDate(item.createdAt) });

        return refreshToken;
    }

    async saveToken(token: SpotifyToken): Promise<void> {
        const item = { ...token, createdAt: convertDateToTs(token.createdAt) };

        return this.dynamoDBClient.putItem(this.tableName, item);
    }
}
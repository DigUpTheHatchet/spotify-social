import { DynamoDBClient, SpotifyToken, SpotifyTokenStorage } from '../../ts';

export class SpotifyTokenDynamoDBStorage implements SpotifyTokenStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, dynamoDBClient: DynamoDBClient) {
        this.tableName = tableName;
        this.dynamoDBClient = dynamoDBClient;
    }

    async getRefreshToken(userId: string): Promise<SpotifyToken> {
        return {
            userId: 'dummy',
            type: 'refresh',
            createdAt: new Date(),
            scopes: []
        };
    }

    async saveToken(userId: string, token: SpotifyToken): Promise<any> {

    }

}
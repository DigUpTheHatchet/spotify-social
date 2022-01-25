import { GetItemInput, ScanInput } from '@aws-sdk/client-dynamodb';
import { SpotifyUserStorage, DynamoDBClient, SpotifyUser } from '../../ts';

const DATE_FIELDS: string[] = ['registeredAt'];

export class SpotifyUserDynamoDBStorage implements SpotifyUserStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(dynamoDBClient: DynamoDBClient, tableName: string) {
        this.tableName = tableName;
        this.dynamoDBClient = dynamoDBClient;
    }

    async saveUser(user: SpotifyUser): Promise<void> {
        return this.dynamoDBClient.putItem(this.tableName, user, DATE_FIELDS);
    }

    async getUser(userId: string): Promise<SpotifyUser> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: { 'userId': { 'S' : userId } } // Partition Key
        };

        const user: SpotifyUser = await this.dynamoDBClient.getItem(params, DATE_FIELDS);

        return user;
    }

    async getAllUsers(): Promise<SpotifyUser[]> {
        const params: ScanInput = { TableName: this.tableName };
        const spotifyUsers: SpotifyUser[] = await this.dynamoDBClient.scan(params, DATE_FIELDS);

        return spotifyUsers;
    }
}


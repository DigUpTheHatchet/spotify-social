import { GetItemInput, ScanInput } from '@aws-sdk/client-dynamodb';
import { SpotifyUserStorage, DynamoDBClient, SpotifyUser } from '../../ts';
import { convertDateToTs, convertTsToDate } from '../../utils/dynamoDBUtils';

export class SpotifyUserDynamoDBStorage implements SpotifyUserStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(dynamoDBClient: DynamoDBClient, tableName: string) {
        this.tableName = tableName;
        this.dynamoDBClient = dynamoDBClient;
    }

    async saveUser(user: SpotifyUser): Promise<void> {
        const item = { ...user, registeredAt: convertDateToTs(user.registeredAt) };

        return this.dynamoDBClient.putItem(this.tableName, item);
    }

    async getUser(userId: string): Promise<SpotifyUser> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: { 'userId': { 'S' : userId } } // Partition Key
        };

        const item = await this.dynamoDBClient.getItem(params);
        const user: SpotifyUser = Object.assign({}, item, { registeredAt: convertTsToDate(item.registeredAt) });

        return user;
    }

    async getAllUsers(): Promise<SpotifyUser[]> {
        const params: ScanInput = { TableName: this.tableName };
        const items = await this.dynamoDBClient.scan(params);

        const spotifyUsers: SpotifyUser[] = items.map(item => {
            return Object.assign({}, item, { registeredAt: convertTsToDate(item.registeredAt) });
        });

        return spotifyUsers;
    }
}


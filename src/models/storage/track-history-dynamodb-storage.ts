import DynamoDBClient from '../../services/dynamodb-wrapper';
import { PlayedTrack, TrackHistoryStorage } from '../../ts';

export class TrackHistoryDynamoDBStorage implements TrackHistoryStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, dynamoDBClient: DynamoDBClient) {
        this.dynamoDBClient = dynamoDBClient;
        this.tableName = tableName;
    }

    async getLastSavedTrack(): Promise<PlayedTrack> {

        const dummyTrack: PlayedTrack = {
            uri: 'dummy',
            id: 'dummy',
            name: 'dummy',
            playedAt: new Date(),
            artistNames: ['dummy']
        };
        return Promise.resolve(dummyTrack);
    }
}
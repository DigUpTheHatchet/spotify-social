import { PlayedTrack, QueryParams, TrackHistoryStorage, DynamoDBClient } from '../../ts';

export class TrackHistoryDynamoDBStorage implements TrackHistoryStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, dynamoDBClient: DynamoDBClient) {
        this.dynamoDBClient = dynamoDBClient;
        this.tableName = tableName;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        const dummyTrack: PlayedTrack = {
            uri: 'dummy',
            id: 'dummy',
            name: 'dummy',
            playedAt: new Date(),
            artistNames: ['dummy']
        };

        const params: QueryParams = {
            // key={userId}, ScanIndexForward=True, limit=1
        };

        const lastSavedTrack: PlayedTrack = await this.dynamoDBClient.query(this.tableName, params);

        return lastSavedTrack;
    }

    async savePlayedTracks(userId: string, tracks: PlayedTrack[]): Promise<void> {

    }

    async getPlayedTracks(userId: string, startDate: Date, endDate: Date): Promise<PlayedTrack[]> {
        const dummyTracks: PlayedTrack[] = [{
            uri: 'dummy',
            id: 'dummy',
            name: 'dummy',
            playedAt: new Date(),
            artistNames: ['dummy']
        }];

        return Promise.resolve(dummyTracks);
    }
}
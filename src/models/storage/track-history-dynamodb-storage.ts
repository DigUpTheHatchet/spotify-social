import { DynamoDBClient } from '../../services/dynamodb-client';
import { PlayedTrack, TrackHistoryStorage } from '../../ts';

export class TrackHistoryDynamoDBStorage implements TrackHistoryStorage {
    private dynamoDBClient: DynamoDBClient;

    constructor(dynamoDBClient: DynamoDBClient) {
        this.dynamoDBClient = dynamoDBClient;
    }

    async getLastSavedTrack(): Promise<PlayedTrack> {

    }
}
import { QueryInput } from '@aws-sdk/client-dynamodb';
import { PlayedTrack, PlayedTracksStorage, DynamoDBClient } from '../../ts';
import { convertDateToTs } from '../../utils/dynamoDBUtils';

const DATE_FIELDS: string[] = ['playedAt'];

export class PlayedTracksDynamoDBStorage implements PlayedTracksStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(dynamoDBClient: DynamoDBClient, tableName: string) {
        this.dynamoDBClient = dynamoDBClient;
        this.tableName = tableName;
    }

    async getLastSavedPlayedTrack(userId: string): Promise<PlayedTrack> {
        const params: QueryInput = {
            TableName: this.tableName,
            ScanIndexForward: false,
            Limit: 1,
            KeyConditionExpression: 'userId = :v_pk', // Partition Key
            ExpressionAttributeValues: {
                ':v_pk': { 'S': userId }
            },
        };

        const results: PlayedTrack[] = await this.dynamoDBClient.query(params, DATE_FIELDS);
        const lastSavedPlayedTrack: PlayedTrack = results[0];

        return lastSavedPlayedTrack;
    }

    async savePlayedTracks(tracks: PlayedTrack[]): Promise<void> {
        return this.dynamoDBClient.batchWriteItems(this.tableName, tracks, DATE_FIELDS);
    }

    async getPlayedTracks(userId: string, fromDate: Date, toDate: Date): Promise<PlayedTrack[]> {
        const params: QueryInput = {
            TableName: this.tableName,
            ScanIndexForward: true,
            // Limit: 10,
            KeyConditionExpression: 'userId = :v_pk AND playedAt BETWEEN :v_from AND :v_to',
            ExpressionAttributeValues: {
                ':v_pk': { 'S': userId }, // Partition Key
                ':v_from': { 'N': convertDateToTs(fromDate).toString() }, // Range Key
                ':v_to': { 'N': convertDateToTs(toDate).toString() }, // Range Key
            },
        };

        const playedTracks: PlayedTrack[] = await this.dynamoDBClient.query(params, DATE_FIELDS);

        return playedTracks;
    }
}
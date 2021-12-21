import { QueryInput } from '@aws-sdk/client-dynamodb';
import { PlayedTrack, PlayedTracksStorage, DynamoDBClient } from '../../ts';
import { convertDateToTs, convertTsToDate } from '../../utils/dynamoDBUtils';

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
            ScanIndexForward: true,
            Limit: 1,
            KeyConditionExpression: 'userId = :v_pk',
            ExpressionAttributeValues: {
                ':v_pk': { 'S': userId }
            },
        };

        const items = await this.dynamoDBClient.query(params);
        const lastSavedPlayedTrack: PlayedTrack = Object.assign({}, items[0], { playedAt: convertTsToDate(items[0].playedAt) });

        return lastSavedPlayedTrack;
    }

    async savePlayedTracks(tracks: PlayedTrack[]): Promise<void> {
        const items = tracks.map(track => Object.assign({}, track, { playedAt: convertDateToTs(track.playedAt) }));

        return this.dynamoDBClient.batchWriteItems(this.tableName, items);
    }

    async getPlayedTracks(userId: string, fromDate: Date, toDate: Date): Promise<PlayedTrack[]> {
        const params: QueryInput = {
            TableName: this.tableName,
            ScanIndexForward: true,
            // Limit: 10,
            KeyConditionExpression: 'userId = :v_pk AND playedAt BETWEEN :v_from AND :v_to',
            ExpressionAttributeValues: {
                ':v_pk': { 'S': userId },
                ':v_from': { 'N': convertDateToTs(fromDate).toString() },
                ':v_to': { 'N': convertDateToTs(toDate).toString() },
            },
        };

        const items = await this.dynamoDBClient.query(params);

        const playedTracks: PlayedTrack[] = items.map(item => {
            return Object.assign({}, item, { playedAt: convertTsToDate(item.playedAt) });
        });

        return playedTracks;
    }
}
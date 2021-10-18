import { BatchWriteItemInput, QueryInput } from '@aws-sdk/client-dynamodb';
import { PlayedTrack, TrackHistoryStorage, DynamoDBClient } from '../../ts';

export class TrackHistoryDynamoDBStorage implements TrackHistoryStorage {
    private dynamoDBClient: DynamoDBClient;
    private tableName: string;

    constructor(tableName: string, dynamoDBClient: DynamoDBClient) {
        this.dynamoDBClient = dynamoDBClient;
        this.tableName = tableName;
    }

    async getLastSavedTrack(userId: string): Promise<PlayedTrack> {
        const params: QueryInput = {
            TableName: this.tableName,
            ScanIndexForward: true,
            Limit: 1,
            KeyConditionExpression: 'userId = :v_pk',
            ExpressionAttributeValues: {
                ':v_pk': { 'S': userId }
            },
        };

        const lastSavedTrack: PlayedTrack = await this.dynamoDBClient.query(params);

        return lastSavedTrack;
    }

    async savePlayedTracks(userId: string, tracks: PlayedTrack[]): Promise<void> {
        const items = tracks.map(track => {
            const { uri, id, name, playedAt, artistNames } = track;
            const playedAtTs: string = (playedAt.valueOf() / 1000).toString();
            return {
                PutRequest: {
                    Item: {
                        userId: { 'S': userId },
                        uri: { 'S': uri },
                        id: { 'S': uri },
                        playedAt: { 'N': playedAtTs },
                        artistNames: { 'SS': artistNames }
                    }
                }
            };
        });

        const params: BatchWriteItemInput = {
            RequestItems: {
                [this.tableName]: items
            }
        };

        return this.dynamoDBClient.batchWriteItem(params);
    }


    async getPlayedTracks(userId: string, fromDate: Date, toDate: Date): Promise<PlayedTrack[]> {
        const fromTs: string = (fromDate.valueOf() / 1000).toString();
        const toTs: string = (toDate.valueOf() / 1000).toString();

        const params: QueryInput = {
            TableName: this.tableName,
            ScanIndexForward: true,
            // Limit: 1,
            KeyConditionExpression: 'userId = :v_pk AND playedAt BETWEEN :v_from AND :v_to',
            ExpressionAttributeValues: {
                ':v_pk': { 'S': userId },
                'v_from': { 'N': fromTs },
                'v_to': { 'N': toTs },
            },
        };

        const playedTracks: PlayedTrack[] = await this.dynamoDBClient.query(params);

        return playedTracks;
    }
}
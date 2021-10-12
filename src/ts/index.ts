export type PlayedTrack = {
    uri: string;
    id: string;
    name: string;
    playedAt: Date;
    artistNames: string[];
};

export interface DynamoDBClient {
    getItem: (tableName: string, key: string) => any;
}

export interface TrackHistoryStorage {
    getLastSavedTrack: () => Promise<PlayedTrack>;
}
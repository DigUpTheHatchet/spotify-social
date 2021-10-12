export type PlayedTrack = {
    uri: string;
    id: string;
    name: string;
    playedAt: Date;
    artistNames: string[];
};

export type Key = any;
export type Item = any;
export type QueryParams = any;

export interface DynamoDBClient {
    getItem: (tableName: string, key: Key) => any;
    putItem: (tableName: string, item: Item) => any;
    query: (tableName: string, params: QueryParams) => any;
    batchPutItem: (tableName: string, items: Item[]) => any;
}

export interface TrackHistoryStorage {
    getLastSavedTrack: (userId: string) => Promise<PlayedTrack>;
    savePlayedTracks: (userId: string, tracks: PlayedTrack[]) => Promise<void>;
    getPlayedTracks: (userId: string, startDate: Date, endDate: Date) => Promise<PlayedTrack[]>;
}
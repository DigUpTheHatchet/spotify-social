import { AttributeValue, BatchWriteItemInput, GetItemInput, PutItemInput, QueryInput } from '@aws-sdk/client-dynamodb';

export type PlayedTrack = {
    spotifyUri: string;
    spotifyId: string;
    trackName: string;
    playedAt: Date;
    artistNames: string[];
};

export interface SpotifyToken {
    type: string;
    value: string;
    userId: string;
    scopes: string[];
    createdAt: Date;
}

// export declare type AttributeDataType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M';

// export type Key = {
//     field: string;
//     value: any
//     type: AttributeDataType
// };

export type DynamoItem = {
    [key: string]: AttributeValue;
} | undefined;
export type QueryParams = any;

export interface DynamoDBClient {
    // getItem: (tableName: string, key: Key) => any;
    // putItem: (tableName: string, item: DynamoItem) => any;
    // query: (tableName: string, params: QueryParams) => any;

    getItem: (params: GetItemInput) => any;
    putItem: (tableName: string, item: any) => any;
    query: (params: QueryInput) => any;
    batchWriteItems: (tableName: string, items: any[]) => any;
}

export interface PlayedTracksStorage {
    getLastSavedTrack: (userId: string) => Promise<PlayedTrack>;
    savePlayedTracks: (userId: string, tracks: PlayedTrack[]) => Promise<void>;
    getPlayedTracks: (userId: string, startDate: Date, endDate: Date) => Promise<PlayedTrack[]>;
}

export interface SpotifyTokenStorage {
    getRefreshToken: (userId: string) => Promise<SpotifyToken>;
    saveToken: (token: SpotifyToken) => Promise<void>;
}
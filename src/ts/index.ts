import { AttributeValue, BatchWriteItemInput, GetItemInput, PutItemInput, QueryInput } from '@aws-sdk/client-dynamodb';

export type PlayedTrack = {
    uri: string;
    id: string;
    name: string;
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

export declare type AttributeDataType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M';

export type Key = {
    field: string;
    value: any
    type: AttributeDataType
};

export type DynamoItem = {
    [key: string]: AttributeValue;
} | undefined;
export type QueryParams = any;

export interface DynamoDBClient {
    // getItem: (tableName: string, key: Key) => any;
    // putItem: (tableName: string, item: DynamoItem) => any;
    // query: (tableName: string, params: QueryParams) => any;

    getItem: (params: GetItemInput) => any;
    putItem: (params: PutItemInput) => any;
    query: (params: QueryInput) => any;
    batchWriteItem: (params: BatchWriteItemInput) => any;
}

export interface TrackHistoryStorage {
    getLastSavedTrack: (userId: string) => Promise<PlayedTrack>;
    savePlayedTracks: (userId: string, tracks: PlayedTrack[]) => Promise<void>;
    getPlayedTracks: (userId: string, startDate: Date, endDate: Date) => Promise<PlayedTrack[]>;
}

export interface SpotifyTokenStorage {
    getRefreshToken: (userId: string) => Promise<SpotifyToken>;
    saveToken: (userId: string, token: SpotifyToken) => Promise<any>;
}
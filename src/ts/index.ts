import { AttributeValue, BatchWriteItemInput, CreateTableInput, DeleteTableInput, GetItemInput, PutItemCommandOutput, PutItemInput, QueryInput } from '@aws-sdk/client-dynamodb';

export type PlayedTrack = {
    spotifyUri: string;
    spotifyId: string;
    trackName: string;
    playedAt: Date;
    userId: string;
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
    // TODO: I'd rather expose less DDB internals (e.g. types) on this interface
    // getItem: (tableName: string, key: Key) => any;
    // putItem: (tableName: string, item: DynamoItem) => any;
    // query: (tableName: string, params: QueryParams) => any;

    getItem: (params: GetItemInput) => Promise<any>;
    putItem: (tableName: string, item: any) => Promise<any>;
    query: (params: QueryInput) => Promise<any>;
    batchWriteItems: (tableName: string, items: any[]) => Promise<any>;

    createTable: (params: CreateTableInput) => Promise<any>;
    deleteTable: (tableName: string) => Promise<any>;
}

export interface PlayedTracksStorage {
    getLastSavedPlayedTrack: (userId: string) => Promise<PlayedTrack>;
    savePlayedTracks: (tracks: PlayedTrack[]) => Promise<void>;
    getPlayedTracks: (userId: string, startDate: Date, endDate: Date) => Promise<PlayedTrack[]>;
}

export interface SpotifyTokenStorage {
    getRefreshToken: (userId: string) => Promise<SpotifyToken>;
    saveToken: (token: SpotifyToken) => Promise<void>;
}